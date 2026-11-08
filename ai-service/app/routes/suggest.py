from fastapi import APIRouter, HTTPException
from app.schemas.review_schema import SuggestRequest, SuggestResponse
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/api/ai", tags=["AI Suggestion Engine"])
gemini_service = GeminiService()

@router.post("/suggest", response_model=SuggestResponse)
async def generate_suggestion(payload: SuggestRequest):
    if not payload.content or not payload.finding:
        raise HTTPException(status_code=400, detail="Content and finding object are required.")

    result = await gemini_service.generate_improved_text(
        content=payload.content,
        finding=payload.finding,
        brand_name=payload.brand_name or "Brand",
        brand_voice=payload.brand_voice or "Professional"
    )

    return result
