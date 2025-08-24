import os
import PyPDF2
from docx import Document
from typing import Optional
from fastapi import UploadFile, HTTPException
from app.core.config import settings

class FileService:
    @staticmethod
    async def validate_file(file: UploadFile) -> bool:
        """Validate uploaded file"""
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Check file size
        if file.size and file.size > settings.max_file_size:
            raise HTTPException(
                status_code=400, 
                detail=f"File size exceeds maximum allowed size of {settings.max_file_size} bytes"
            )
        
        # Check file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in settings.allowed_file_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(settings.allowed_file_types)}"
            )
        
        return True
    
    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(file.file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error reading PDF file: {str(e)}"
            )
    
    @staticmethod
    async def extract_text_from_docx(file: UploadFile) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file.file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error reading DOCX file: {str(e)}"
            )
    
    @staticmethod
    async def extract_text_from_file(file: UploadFile) -> str:
        """Extract text from uploaded file based on file type"""
        await FileService.validate_file(file)
        
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension == ".pdf":
            return await FileService.extract_text_from_pdf(file)
        elif file_extension in [".docx", ".doc"]:
            return await FileService.extract_text_from_docx(file)
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type"
            )
