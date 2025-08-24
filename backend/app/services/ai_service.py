import os
from typing import Dict, List, Any
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.core.config import settings

class AIService:
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=settings.groq_api_key,
            model_name=settings.groq_model
        )
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    async def extract_resume_info(self, resume_text: str) -> Dict[str, Any]:
        """Extract key information from resume text"""
        system_prompt = """
        You are an expert resume parser. Extract the following information from the resume:
        1. Skills (technical and soft skills)
        2. Work experience (company, role, duration, key achievements)
        3. Education (degree, institution, year)
        4. Projects (name, description, technologies used)
        5. Certifications
        6. Key achievements and accomplishments
        
        Return the information in a structured JSON format.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Parse this resume:\n\n{resume_text}")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def generate_resume_summary(self, resume_text: str) -> str:
        """Generate a concise summary of the resume"""
        system_prompt = """
        Create a professional summary of this resume in 2-3 sentences. 
        Focus on the candidate's key strengths, experience level, and most relevant skills.
        Make it suitable for quick review by hiring managers.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Summarize this resume:\n\n{resume_text}")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def analyze_jd_requirements(self, job_description: str) -> Dict[str, Any]:
        """Analyze job description to extract requirements"""
        system_prompt = """
        Analyze this job description and extract:
        1. Required skills (technical and soft skills)
        2. Required experience level and years
        3. Key responsibilities
        4. Preferred qualifications
        5. Industry/domain knowledge needed
        
        Return the information in a structured JSON format.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Analyze this job description:\n\n{job_description}")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def calculate_matching_score(self, resume_text: str, job_description: str) -> float:
        """Calculate matching score between resume and job description"""
        # Create embeddings
        resume_chunks = self.text_splitter.split_text(resume_text)
        jd_chunks = self.text_splitter.split_text(job_description)
        
        resume_embeddings = self.embeddings.embed_documents(resume_chunks)
        jd_embeddings = self.embeddings.embed_documents(jd_chunks)
        
        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(resume_embeddings, jd_embeddings)
        
        # Get maximum similarity for each resume chunk
        max_similarities = np.max(similarity_matrix, axis=1)
        
        # Calculate weighted average similarity
        matching_score = float(np.mean(max_similarities))
        
        return matching_score
    
    async def generate_interview_insights(self, resume_text: str, job_description: str, matching_score: float) -> Dict[str, Any]:
        """Generate interview insights and discussion areas"""
        system_prompt = """
        Based on the resume, job description, and matching score, provide interview insights:
        
        1. Suggested discussion topics (3-5 topics)
        2. Candidate strengths to explore
        3. Areas for improvement or concerns
        4. Technical questions to ask
        5. Behavioral questions to ask
        6. Cultural fit assessment
        
        Return as structured JSON with clear sections.
        """
        
        prompt = f"""
        Resume: {resume_text[:1000]}...
        Job Description: {job_description[:1000]}...
        Matching Score: {matching_score:.2f}
        
        Generate interview insights based on this information.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def analyze_skills_match(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze skills matching between resume and job description"""
        system_prompt = """
        Compare the skills mentioned in the resume with the required skills in the job description.
        Categorize skills as:
        1. Perfect match (exact or very close match)
        2. Partial match (related skills)
        3. Missing skills (required but not found in resume)
        4. Bonus skills (in resume but not required)
        
        Return as structured JSON with skill categories and confidence levels.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Resume: {resume_text}\n\nJob Description: {job_description}")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def analyze_experience_match(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze experience level matching"""
        system_prompt = """
        Analyze if the candidate's experience level matches the job requirements:
        1. Years of experience comparison
        2. Role level alignment (junior/mid/senior)
        3. Industry experience relevance
        4. Project complexity assessment
        5. Leadership experience evaluation
        
        Return as structured JSON with detailed analysis.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Resume: {resume_text}\n\nJob Description: {job_description}")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
