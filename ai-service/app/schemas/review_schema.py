from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class Finding(BaseModel):
    category: str = Field(..., description="Category of the finding")
    severity: str = Field(..., description="Critical, Warning, Suggestion, or Passed")
    issue: str = Field(..., description="Summary of the issue found")
    original_text: str = Field(default="", description="The specific problematic snippet from submitted content")
    explanation: str = Field(..., description="Why this conflicts with approved guidelines")
    guideline_reference: str = Field(default="Brand Governance Policy", description="Cited rule or policy section")
    source_reference: str = Field(default="Brand Guidelines", description="Source document or reference file")
    suggested_correction: str = Field(default="", description="Actionable replacement text maintaining voice and facts")
    verification_status: str = Field(default="Needs Review", description="Needs Review, Verified Fact, Requires Human Verification, Passed")

class PassedCheck(BaseModel):
    rule: str
    details: str

class BrandVoiceModel(BaseModel):
    tone: Optional[List[str]] = ["Professional", "Authoritative"]
    formality: Optional[str] = "Semi-Formal"
    dos: Optional[List[str]] = []
    donts: Optional[List[str]] = []
    reading_level: Optional[str] = "Grade 9-12"

class BrandProfileInput(BaseModel):
    id: Optional[str] = None
    name: str
    industry: Optional[str] = "Technology"
    description: Optional[str] = ""
    brand_voice: Optional[Any] = None
    target_audience: Optional[str] = ""
    preferred_terms: Optional[List[Any]] = []
    restricted_terms: Optional[List[Any]] = []
    approved_facts: Optional[List[Any]] = []
    prohibited_claims: Optional[List[Any]] = []
    guidelines: Optional[List[Any]] = []

class AnalyzeRequest(BaseModel):
    content: str
    content_type: Optional[str] = "Marketing Copy"
    title: Optional[str] = "Untitled"
    brand: Optional[BrandProfileInput] = None

class AnalysisResponse(BaseModel):
    consistency_score: int
    summary: str
    findings: List[Finding]
    passed_checks: List[PassedCheck] = []
    warnings: List[str] = []
    improved_content: str
    model_used: str

class SuggestRequest(BaseModel):
    content: str
    finding: Optional[Dict[str, Any]] = None
    brand_name: Optional[str] = None
    brand_voice: Optional[str] = None

class SuggestResponse(BaseModel):
    improved_text: str
    explanation: str
    alternatives: List[str] = []
