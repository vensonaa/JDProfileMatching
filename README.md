# JD Profile Matching - GenAI Solution

A comprehensive AI-powered solution for matching job descriptions with candidate profiles/resumes, providing intelligent insights and interview preparation guidance.

## Features

- **Smart Profile Analysis**: AI-powered resume parsing and analysis
- **JD-Profile Matching**: Intelligent matching between job requirements and candidate profiles
- **Resume Summary**: Automated generation of concise resume summaries
- **Interview Insights**: Suggested discussion areas for interviewers based on JD-profile alignment
- **Modern UI**: Vibrant, responsive React interface with beautiful design
- **FastAPI Backend**: High-performance Python backend with LangGraph integration
- **Groq LLM Integration**: Fast and reliable AI processing

## Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios for API calls
- React Hook Form
- Lucide React Icons

### Backend
- FastAPI (Python)
- LangGraph for workflow orchestration
- Groq LLM API
- SQLite database
- Pydantic for data validation
- Uvicorn server

## Project Structure

```
JDProfileMatching/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── core/            # Core configuration
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── requirements.txt
│   └── main.py
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JDProfileMatching
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   - Create `.env` file in backend directory with your Groq API key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn main:app --reload --port 8000

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Usage

1. **Upload Resume/CV**: Drag and drop or select a PDF/DOCX resume file
2. **Enter Job Description**: Paste or type the job description
3. **Generate Analysis**: Click to analyze and get matching results
4. **Review Results**: View matching score, resume summary, and interview insights

## API Endpoints

- `POST /api/analyze-match`: Analyze JD-profile matching
- `POST /api/summarize-resume`: Generate resume summary
- `POST /api/interview-insights`: Get interview discussion areas
- `GET /api/health`: Health check endpoint

## Features in Detail

### 1. Resume Analysis
- Extracts key information (skills, experience, education)
- Identifies relevant achievements and projects
- Analyzes skill proficiency levels

### 2. JD-Profile Matching
- Semantic similarity analysis
- Skill requirement matching
- Experience level assessment
- Cultural fit indicators

### 3. Interview Insights
- Suggested discussion topics
- Candidate strengths and areas for improvement
- Technical vs. soft skill assessment
- Behavioral interview questions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
