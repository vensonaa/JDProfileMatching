import axios from 'axios';
import { 
  AnalysisRequest, 
  AnalysisResponse, 
  ResumeSummaryRequest, 
  ResumeSummaryResponse,
  UploadResponse 
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    // You can add loading state management here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Analyze JD-Profile matching
  async analyzeMatch(data: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await api.post<AnalysisResponse>('/analyze-match', data);
    return response.data;
  },

  // Upload resume file
  async uploadResume(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate resume summary
  async summarizeResume(data: ResumeSummaryRequest): Promise<ResumeSummaryResponse> {
    const response = await api.post<ResumeSummaryResponse>('/summarize-resume', data);
    return response.data;
  },

  // Get analysis by ID
  async getAnalysis(id: number): Promise<AnalysisResponse> {
    const response = await api.get<AnalysisResponse>(`/analyses/${id}`);
    return response.data;
  },

  // List recent analyses
  async listAnalyses(skip: number = 0, limit: number = 10): Promise<AnalysisResponse[]> {
    const response = await api.get<AnalysisResponse[]>(`/analyses?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;
