# JD Profile Matching - Demo Guide

## 🚀 Quick Start Demo

This guide will walk you through testing the JD Profile Matching application with sample data.

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed
- Groq API key (get one free at https://console.groq.com/)

### Step 1: Setup
1. Clone the repository
2. Copy `backend/env.example` to `backend/.env`
3. Add your Groq API key to `backend/.env`
4. Run the startup script: `./start.sh`

### Step 2: Test the Application

#### Option A: Using Sample Data
1. Navigate to http://localhost:5173
2. Click "Start Analysis"
3. For resume text, copy from `sample_data/sample_resume.txt`
4. For job description, copy from `sample_data/sample_job_description.txt`
5. Click "Start Analysis"

#### Option B: Upload Real Files
1. Navigate to http://localhost:5173
2. Click "Start Analysis"
3. Upload a PDF/DOCX resume file
4. Paste a real job description
5. Click "Start Analysis"

### Step 3: Review Results

The analysis will provide:

#### 📊 Matching Score
- Visual circular progress indicator
- Percentage match score
- Score breakdown (Skills, Experience, Cultural Fit)

#### 📝 Resume Summary
- AI-generated concise summary
- Key highlights and strengths
- Professional overview

#### 🎯 Skills Match Analysis
- **Perfect Matches**: Skills that exactly match requirements
- **Partial Matches**: Related or similar skills
- **Missing Skills**: Required skills not found in resume
- **Bonus Skills**: Additional valuable skills

#### 💼 Experience Match
- Years of experience comparison
- Role level alignment
- Industry relevance assessment
- Project complexity evaluation

#### 🗣️ Interview Insights
- **Discussion Topics**: Suggested conversation areas
- **Candidate Strengths**: Key strengths to explore
- **Areas for Improvement**: Potential concerns
- **Cultural Fit**: Team compatibility assessment

### Step 4: API Testing

You can also test the API directly:

```bash
# Health check
curl http://localhost:8000/api/health

# Analyze match
curl -X POST http://localhost:8000/api/analyze-match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Your resume text here...",
    "job_description": "Your job description here..."
  }'

# Upload resume file
curl -X POST http://localhost:8000/api/upload-resume \
  -F "file=@path/to/resume.pdf"
```

### Step 5: Features to Explore

#### 🎨 UI Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Vibrant Colors**: Modern gradient design with vibrant color scheme
- **Smooth Animations**: Framer Motion animations throughout
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: Beautiful loading indicators

#### 🤖 AI Features
- **Smart Matching**: Semantic similarity analysis
- **Resume Parsing**: Intelligent text extraction
- **Skill Analysis**: Detailed skill categorization
- **Experience Assessment**: Multi-dimensional experience evaluation
- **Interview Guidance**: AI-generated interview insights

#### 📱 User Experience
- **Drag & Drop**: Easy file upload interface
- **Real-time Feedback**: Toast notifications
- **Copy/Share**: Easy result sharing
- **Navigation**: Intuitive routing between pages
- **Error Handling**: Graceful error management

### Expected Results

With the sample data, you should see:
- **Matching Score**: ~85-90% (excellent match)
- **Perfect Skills**: React, JavaScript, Node.js, Python, etc.
- **Experience Level**: Senior level alignment
- **Interview Topics**: Technical skills, leadership, project management

### Troubleshooting

#### Common Issues:
1. **API Key Error**: Ensure Groq API key is set in `.env`
2. **Port Conflicts**: Check if ports 8000 and 5173 are available
3. **File Upload Issues**: Ensure file is PDF/DOCX and under 10MB
4. **Slow Analysis**: First run may be slower due to model loading

#### Performance Tips:
- Use shorter text for faster analysis
- Ensure stable internet connection
- Close other resource-intensive applications

### Next Steps

1. **Customize**: Modify prompts in `ai_service.py` for different analysis styles
2. **Extend**: Add more analysis types or export formats
3. **Deploy**: Deploy to cloud platforms like Heroku or AWS
4. **Scale**: Add user authentication and multi-tenant support

### Support

For issues or questions:
- Check the README.md for detailed setup instructions
- Review the API documentation at http://localhost:8000/docs
- Check console logs for error details

---

**Happy Testing! 🎉**
