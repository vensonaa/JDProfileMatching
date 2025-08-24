import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Brain, FileText, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import FileUpload from '../components/FileUpload';
import { apiService } from '../services/api';
import { AnalysisRequest } from '../types';

interface FormData {
  job_description: string;
}

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>();

  const jobDescription = watch('job_description');

  const handleFileUpload = (text: string) => {
    setResumeText(text);
  };

  const handleFileRemove = () => {
    setResumeText('');
  };

  const onSubmit = async (data: FormData) => {
    if (!resumeText.trim()) {
      toast.error('Please upload a resume first');
      return;
    }

    if (!data.job_description.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      const request: AnalysisRequest = {
        resume_text: resumeText,
        job_description: data.job_description
      };

      const response = await apiService.analyzeMatch(request);
      
      toast.success('Analysis completed successfully!');
      navigate(`/results/${response.id}`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full mb-4">
          <Brain className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">AI Analysis</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze JD-Profile Match
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a resume and enter a job description to get intelligent matching analysis, 
          resume summary, and interview insights.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Resume Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Step 1: Upload Resume</h2>
              <p className="text-gray-600">Upload a PDF, DOCX, or DOC file</p>
            </div>
          </div>
          
          <FileUpload
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            uploadedText={resumeText}
          />
        </motion.div>

        {/* Job Description Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Step 2: Job Description</h2>
              <p className="text-gray-600">Paste or type the job description</p>
            </div>
          </div>
          
          <div className="card">
            <textarea
              {...register('job_description', { 
                required: 'Job description is required',
                minLength: {
                  value: 50,
                  message: 'Job description must be at least 50 characters'
                }
              })}
              placeholder="Paste the job description here... Include requirements, responsibilities, and preferred qualifications."
              className="input-field min-h-[200px] resize-none"
              rows={8}
            />
            
            {errors.job_description && (
              <p className="text-error-600 text-sm mt-2">
                {errors.job_description.message}
              </p>
            )}
            
            {jobDescription && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Character count:</span> {jobDescription.length}
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={isAnalyzing || !resumeText || !jobDescription}
            className={`btn-primary text-lg px-8 py-4 ${
              (isAnalyzing || !resumeText || !jobDescription) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
          
          {isAnalyzing && (
            <p className="text-gray-600 mt-4">
              This may take a few moments. Our AI is analyzing the match...
            </p>
          )}
        </motion.div>
      </form>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
          <p className="text-gray-600 text-sm">
            Advanced machine learning algorithms analyze skills, experience, and cultural fit.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Resume Summary</h3>
          <p className="text-gray-600 text-sm">
            Get a concise, professional summary of the candidate's profile.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Interview Insights</h3>
          <p className="text-gray-600 text-sm">
            Receive suggested discussion topics and questions for effective interviews.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;
