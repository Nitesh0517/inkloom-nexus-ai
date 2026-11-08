from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.review_schema import AnalyzeRequest, AnalysisResponse
from app.services.gemini_service import GeminiService
from app.services.document_service import DocumentService

router = APIRouter(prefix="/api/ai", tags=["AI Governance Analysis"])
gemini_service = GeminiService()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_content_endpoint(payload: AnalyzeRequest):
    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    result = await gemini_service.analyze_content(payload)
    return result

@router.post("/extract-text")
async def extract_document_text(file: UploadFile = File(...)):
    contents = await file.read()
    extracted = DocumentService.extract_text(contents, file.filename)
    return {
        "filename": file.filename,
        "size_bytes": len(contents),
        "text": extracted
    }
