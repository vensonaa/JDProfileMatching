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
        print(f"Validating file: {file.filename}, size: {file.size}")
        
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
        print(f"File extension: {file_extension}, allowed types: {settings.allowed_file_types}")
        
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
            print("Extracting text from PDF file")
            
            # Read the file content first
            content = await file.read()
            
            # Try to create a BytesIO object for PyPDF2
            import io
            pdf_stream = io.BytesIO(content)
            
            try:
                pdf_reader = PyPDF2.PdfReader(pdf_stream)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                
                if not text.strip():
                    # If no text extracted, try alternative method
                    print("No text extracted, trying alternative method")
                    return "PDF content could not be extracted. Please ensure the PDF contains selectable text."
                
                print(f"Extracted {len(text)} characters from PDF")
                return text.strip()
                
            except Exception as pdf_error:
                print(f"PyPDF2 error: {pdf_error}")
                # Try alternative PDF processing
                try:
                    import fitz  # PyMuPDF
                    pdf_stream.seek(0)  # Reset stream position
                    doc = fitz.open(stream=pdf_stream, filetype="pdf")
                    text = ""
                    for page in doc:
                        text += page.get_text() + "\n"
                    doc.close()
                    
                    if text.strip():
                        print(f"Extracted {len(text)} characters using PyMuPDF")
                        return text.strip()
                    else:
                        return "PDF content could not be extracted. Please ensure the PDF contains selectable text."
                        
                except ImportError:
                    print("PyMuPDF not available")
                    return "PDF processing failed. Please ensure the PDF is not corrupted and contains selectable text."
                except Exception as alt_error:
                    print(f"Alternative PDF processing failed: {alt_error}")
                    return "PDF content could not be extracted. Please ensure the PDF contains selectable text."
                    
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return "Error processing PDF file. Please ensure the file is not corrupted."
    
    @staticmethod
    async def extract_text_from_docx(file: UploadFile) -> str:
        """Extract text from DOCX file"""
        try:
            print("Extracting text from DOCX file")
            doc = Document(file.file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            print(f"Extracted {len(text)} characters from DOCX")
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Error reading DOCX file: {str(e)}"
            )
    
    @staticmethod
    async def extract_text_from_txt(file: UploadFile) -> str:
        """Extract text from TXT file"""
        try:
            print("Extracting text from TXT file")
            content = await file.read()
            text = content.decode('utf-8')
            print(f"Extracted {len(text)} characters from TXT")
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from TXT: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Error reading TXT file: {str(e)}"
            )
    
    @staticmethod
    async def extract_text_from_file(file: UploadFile) -> str:
        """Extract text from uploaded file based on file type"""
        print(f"Processing file: {file.filename}")
        
        try:
            await FileService.validate_file(file)
            
            file_extension = os.path.splitext(file.filename)[1].lower()
            
            if file_extension == ".pdf":
                result = await FileService.extract_text_from_pdf(file)
                if result.startswith("Error") or result.startswith("PDF content could not be extracted"):
                    raise HTTPException(status_code=400, detail=result)
                return result
            elif file_extension in [".docx", ".doc"]:
                return await FileService.extract_text_from_docx(file)
            elif file_extension == ".txt":
                return await FileService.extract_text_from_txt(file)
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file type"
                )
        except Exception as e:
            print(f"Error in extract_text_from_file: {e}")
            raise e
