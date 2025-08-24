from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime
import json

from app.models.database import get_db, Analysis
from app.services.ai_service import AIService
from app.services.file_service import FileService
from app.api.schemas import (
    AnalysisRequest, AnalysisResponse, ResumeSummaryRequest,
    ResumeSummaryResponse, InterviewInsightsRequest, InterviewInsightsResponse,
    HealthResponse, ErrorResponse
)

router = APIRouter()
ai_service = AIService()

@router.post("/analyze-match", response_model=AnalysisResponse)
async def analyze_match(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    """Analyze matching between resume and job description"""
    try:
        # Calculate matching score
        matching_score = await ai_service.calculate_matching_score(
            request.resume_text, request.job_description
        )
        
        # Generate resume summary
        resume_summary = await ai_service.generate_resume_summary(request.resume_text)
        
        # Generate interview insights
        interview_insights = await ai_service.generate_interview_insights(
            request.resume_text, request.job_description, matching_score
        )
        
        # Analyze skills match
        skills_match = await ai_service.analyze_skills_match(
            request.resume_text, request.job_description
        )
        
        # Analyze experience match
        experience_match = await ai_service.analyze_experience_match(
            request.resume_text, request.job_description
        )
        
        # Save to database
        analysis = Analysis(
            resume_text=request.resume_text,
            job_description=request.job_description,
            matching_score=matching_score,
            resume_summary=resume_summary,
            interview_insights=interview_insights,
            skills_match=skills_match,
            experience_match=experience_match
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return AnalysisResponse(
            id=analysis.id,
            matching_score=analysis.matching_score,
            resume_summary=analysis.resume_summary,
            interview_insights=analysis.interview_insights,
            skills_match=analysis.skills_match,
            experience_match=analysis.experience_match,
            created_at=analysis.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and extract text from resume file"""
    print(f"Upload resume called with file: {file.filename}")
    try:
        print("About to call FileService.extract_text_from_file")
        resume_text = await FileService.extract_text_from_file(file)
        print(f"Successfully extracted text: {len(resume_text)} characters")
        return {"resume_text": resume_text}
    except Exception as e:
        print(f"Error in upload_resume: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/summarize-resume", response_model=ResumeSummaryResponse)
async def summarize_resume(request: ResumeSummaryRequest):
    """Generate summary of resume"""
    try:
        summary = await ai_service.generate_resume_summary(request.resume_text)
        return ResumeSummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@router.post("/interview-insights", response_model=InterviewInsightsResponse)
async def get_interview_insights(request: InterviewInsightsRequest):
    """Get interview insights based on resume and job description"""
    try:
        insights = await ai_service.generate_interview_insights(
            request.resume_text, request.job_description, request.matching_score
        )
        return InterviewInsightsResponse(insights=insights)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insights generation failed: {str(e)}")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="JD Profile Matching API",
        timestamp=datetime.utcnow()
    )

@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Get analysis by ID"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return AnalysisResponse(
        id=analysis.id,
        matching_score=analysis.matching_score,
        resume_summary=analysis.resume_summary,
        interview_insights=analysis.interview_insights,
        skills_match=analysis.skills_match,
        experience_match=analysis.experience_match,
        created_at=analysis.created_at
    )

@router.get("/analyses", response_model=list[AnalysisResponse])
async def list_analyses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List recent analyses"""
    analyses = db.query(Analysis).offset(skip).limit(limit).all()
    return [
        AnalysisResponse(
            id=analysis.id,
            matching_score=analysis.matching_score,
            resume_summary=analysis.resume_summary,
            interview_insights=analysis.interview_insights,
            skills_match=analysis.skills_match,
            experience_match=analysis.experience_match,
            created_at=analysis.created_at
        )
        for analysis in analyses
    ]
