from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class ResumeSummaryRequest(BaseModel):
    resume_text: str

class InterviewInsightsRequest(BaseModel):
    resume_text: str
    job_description: str
    matching_score: float

class AnalysisResponse(BaseModel):
    id: int
    matching_score: float
    resume_summary: str
    interview_insights: Dict[str, Any]
    skills_match: Dict[str, Any]
    experience_match: Dict[str, Any]
    created_at: datetime

class ResumeSummaryResponse(BaseModel):
    summary: str

class InterviewInsightsResponse(BaseModel):
    insights: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
