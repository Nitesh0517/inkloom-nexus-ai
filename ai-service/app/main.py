from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes.analyze import router as analyze_router
from app.routes.suggest import router as suggest_router
from app.services.gemini_service import GeminiService

app = FastAPI(
    title="Inkloom AI – Brand Governance Engine",
    description="Intelligent Brand Consistency, Tone Analysis, and Fact Verification Service powered by Google Gemini",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI routers
app.include_router(analyze_router)
app.include_router(suggest_router)

@app.get("/")
def read_root():
    return {
        "service": "Inkloom AI Processing Microservice",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    gemini_svc = GeminiService()
    return {
        "status": "healthy",
        "gemini_api_configured": gemini_svc.is_available(),
        "model": gemini_svc.model_name,
        "environment": os.getenv("ENVIRONMENT", "development")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
