import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  Target,
  FileText,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

import MatchingScore from '../components/MatchingScore';
import { apiService } from '../services/api';
import { AnalysisResponse } from '../types';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      
      try {
        const data = await apiService.getAnalysis(parseInt(id));
        setAnalysis(data);
      } catch (err) {
        setError('Failed to load analysis results');
        toast.error('Failed to load analysis results');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleCopyResults = async () => {
    if (!analysis) return;
    
    const resultsText = `
JD-Profile Matching Analysis Results

Matching Score: ${Math.round(analysis.matching_score * 100)}%

Resume Summary:
${analysis.resume_summary}

Interview Insights:
- Discussion Topics: ${analysis.interview_insights.discussion_topics?.join(', ')}
- Candidate Strengths: ${analysis.interview_insights.candidate_strengths?.join(', ')}
- Areas for Improvement: ${analysis.interview_insights.areas_for_improvement?.join(', ')}

Skills Match:
- Perfect Matches: ${analysis.skills_match.perfect_match?.join(', ')}
- Partial Matches: ${analysis.skills_match.partial_match?.join(', ')}
- Missing Skills: ${analysis.skills_match.missing_skills?.join(', ')}

Experience Match:
- Years of Experience: ${analysis.experience_match.years_experience}
- Role Level: ${analysis.experience_match.role_level}
- Industry Relevance: ${analysis.experience_match.industry_relevance}
    `.trim();

    try {
      await navigator.clipboard.writeText(resultsText);
      toast.success('Results copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy results');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JD-Profile Matching Analysis',
          text: `Check out this JD-Profile matching analysis with ${Math.round(analysis!.matching_score * 100)}% match score!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyResults();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
        <p className="text-gray-600 mb-6">{error || 'Analysis not found'}</p>
        <Link to="/analyze" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start New Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link to="/analyze" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
            <p className="text-gray-600">Analysis ID: {analysis.id}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleCopyResults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </motion.div>

      {/* Matching Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Matching Score</h2>
        <MatchingScore score={analysis.matching_score} size="lg" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Resume Summary</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              {analysis.resume_summary}
            </p>
          </div>
        </motion.div>

        {/* Skills Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Skills Match</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-success-700 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Perfect Matches
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills_match.perfect_match?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-warning-700 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Partial Matches
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills_match.partial_match?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-error-700 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills_match.missing_skills?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-error-100 text-error-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experience Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Experience Match</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Years of Experience</h3>
            <p className="text-gray-900">{analysis.experience_match.years_experience}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Role Level</h3>
            <p className="text-gray-900">{analysis.experience_match.role_level}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Industry Relevance</h3>
            <p className="text-gray-900">{analysis.experience_match.industry_relevance}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Project Complexity</h3>
            <p className="text-gray-900">{analysis.experience_match.project_complexity}</p>
          </div>
        </div>
      </motion.div>

      {/* Interview Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Interview Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Discussion Topics</h3>
            <ul className="space-y-2">
              {analysis.interview_insights.discussion_topics?.map((topic, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Candidate Strengths</h3>
            <ul className="space-y-2">
              {analysis.interview_insights.candidate_strengths?.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
            <ul className="space-y-2">
              {analysis.interview_insights.areas_for_improvement?.map((area, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cultural Fit</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {analysis.interview_insights.cultural_fit}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
