export interface AnalysisRequest {
  resume_text: string;
  job_description: string;
}

export interface AnalysisResponse {
  id: number;
  matching_score: number;
  resume_summary: string;
  interview_insights: InterviewInsights;
  skills_match: SkillsMatch;
  experience_match: ExperienceMatch;
  created_at: string;
}

export interface InterviewInsights {
  discussion_topics: string[];
  candidate_strengths: string[];
  areas_for_improvement: string[];
  technical_questions: string[];
  behavioral_questions: string[];
  cultural_fit: string;
}

export interface SkillsMatch {
  perfect_match: string[];
  partial_match: string[];
  missing_skills: string[];
  bonus_skills: string[];
}

export interface ExperienceMatch {
  years_experience: string;
  role_level: string;
  industry_relevance: string;
  project_complexity: string;
  leadership_experience: string;
}

export interface ResumeSummaryRequest {
  resume_text: string;
}

export interface ResumeSummaryResponse {
  summary: string;
}

export interface UploadResponse {
  resume_text: string;
}
