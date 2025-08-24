from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.core.config import settings

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_text = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    matching_score = Column(Float, nullable=False)
    resume_summary = Column(Text, nullable=False)
    interview_insights = Column(JSON, nullable=False)
    skills_match = Column(JSON, nullable=False)
    experience_match = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, score={self.matching_score})>"

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
