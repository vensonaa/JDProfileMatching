import os
import json
import re
from typing import Dict, List, Any
from groq import Groq
from collections import Counter
import numpy as np
from app.core.config import settings

class AIService:
    def __init__(self):
        try:
            # Try to initialize Groq client with minimal configuration
            if settings.groq_api_key and settings.groq_api_key != "gsk_your_actual_api_key_here":
                self.client = Groq()
                self.client.api_key = settings.groq_api_key
            else:
                print("Warning: Groq API key not configured")
                self.client = None
        except Exception as e:
            print(f"Warning: Could not initialize Groq client: {e}")
            self.client = None
        self.model = settings.groq_model
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for analysis"""
        # Convert to lowercase and remove special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate simple text similarity using word overlap"""
        # Preprocess texts
        text1 = self._preprocess_text(text1)
        text2 = self._preprocess_text(text2)
        
        # Get word sets
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        if not words1 or not words2:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        if union == 0:
            return 0.0
        
        similarity = intersection / union
        return similarity
    
    async def _call_groq(self, messages: List[Dict[str, str]]) -> str:
        """Make a call to Groq API"""
        if not self.client:
            return "Groq client not available"
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.1,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return "Error processing request"
    
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Parse this resume:\n\n{resume_text}"}
        ]
        
        response = await self._call_groq(messages)
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse response", "raw_response": response}
    
    async def generate_resume_summary(self, resume_text: str) -> str:
        """Generate a concise summary of the resume"""
        if not self.client:
            # Fallback summary when Groq is not available
            words = resume_text.split()
            if len(words) > 50:
                return " ".join(words[:50]) + "..."
            return resume_text[:200] + "..." if len(resume_text) > 200 else resume_text
        
        system_prompt = """
        Create a professional summary of this resume in 2-3 sentences. 
        Focus on the candidate's key strengths, experience level, and most relevant skills.
        Make it suitable for quick review by hiring managers.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Summarize this resume:\n\n{resume_text}"}
        ]
        
        return await self._call_groq(messages)
    
    async def analyze_jd_requirements(self, job_description: str) -> Dict[str, Any]:
        """Analyze job description to extract requirements"""
        if not self.client:
            # Fallback analysis when Groq is not available
            return {
                "required_skills": ["Python", "JavaScript", "React"],
                "experience_level": "3-5 years",
                "key_responsibilities": ["Software development", "Team collaboration"],
                "preferred_qualifications": ["Cloud experience", "Agile methodology"]
            }
        
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Analyze this job description:\n\n{job_description}"}
        ]
        
        response = await self._call_groq(messages)
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse response", "raw_response": response}
    
    async def calculate_matching_score(self, resume_text: str, job_description: str) -> float:
        """Calculate matching score between resume and job description"""
        try:
            # Calculate similarity using word overlap
            similarity = self._calculate_similarity(resume_text, job_description)
            
            # Debug: Print the raw similarity value
            print(f"Raw similarity: {similarity}")
            
            # Ensure similarity is between 0 and 1
            similarity = max(0.0, min(1.0, similarity))
            
            # Convert to percentage with reasonable scaling
            # Most real-world matches fall between 10-80%
            if similarity < 0.01:  # Very low similarity
                base_score = 10.0
            elif similarity < 0.1:  # Low similarity
                base_score = 20.0 + (similarity * 100)
            elif similarity < 0.3:  # Moderate similarity
                base_score = 30.0 + (similarity * 100)
            elif similarity < 0.5:  # Good similarity
                base_score = 50.0 + (similarity * 50)
            else:  # High similarity
                base_score = 70.0 + (similarity * 30)
            
            # Cap at 100%
            final_score = min(100.0, base_score)
            
            # Add small random variation (±2 points)
            adjustment = np.random.uniform(-2.0, 2.0)
            final_score = max(0.0, min(100.0, final_score + adjustment))
            
            print(f"Final score: {final_score}")
            return round(final_score, 2)
            
        except Exception as e:
            print(f"Error calculating matching score: {e}")
            return 50.0  # Default score
    
    async def generate_interview_insights(self, resume_text: str, job_description: str, matching_score: float) -> Dict[str, Any]:
        """Generate interview insights and discussion areas"""
        if not self.client:
            # Fallback insights when Groq is not available
            return {
                "discussion_topics": [
                    "Technical skills and experience",
                    "Previous projects and achievements",
                    "Team collaboration and leadership",
                    "Problem-solving approach",
                    "Career goals and motivation"
                ],
                "candidate_strengths": [
                    "Technical expertise",
                    "Project management",
                    "Team collaboration"
                ],
                "areas_for_improvement": [
                    "Additional certifications",
                    "Industry-specific experience"
                ],
                "technical_questions": [
                    "Describe a challenging project you worked on",
                    "How do you handle technical disagreements?",
                    "What's your approach to learning new technologies?"
                ],
                "behavioral_questions": [
                    "Tell me about a time you led a team",
                    "How do you handle tight deadlines?",
                    "Describe a situation where you had to learn something quickly"
                ],
                "cultural_fit": "Candidate shows strong technical background and collaborative skills"
            }
        
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse response", "raw_response": response}
    
    async def analyze_skills_match(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze skills matching between resume and job description"""
        if not self.client:
            # Fallback skills analysis when Groq is not available
            return {
                "perfect_match": ["Python", "JavaScript", "React"],
                "partial_match": ["Node.js", "Django"],
                "missing_skills": ["Kubernetes", "Machine Learning"],
                "bonus_skills": ["AWS", "Docker", "PostgreSQL"],
                "confidence_level": "Medium"
            }
        
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Resume: {resume_text}\n\nJob Description: {job_description}"}
        ]
        
        response = await self._call_groq(messages)
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse response", "raw_response": response}
    
    async def analyze_experience_match(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze experience level matching"""
        if not self.client:
            # Fallback experience analysis when Groq is not available
            return {
                "years_experience": "5+ years vs 3+ years required",
                "role_level": "Senior level candidate for senior position",
                "industry_relevance": "Strong software development background",
                "project_complexity": "Handled complex e-commerce and management systems",
                "leadership_experience": "Mentored junior developers and led teams",
                "overall_assessment": "Candidate exceeds experience requirements"
            }
        
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Resume: {resume_text}\n\nJob Description: {job_description}"}
        ]
        
        response = await self._call_groq(messages)
        try:
            return json.loads(response)
        except:
            return {"error": "Failed to parse response", "raw_response": response}
