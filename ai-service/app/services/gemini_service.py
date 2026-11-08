import os
import json
import re
import httpx
from typing import Dict, Any, List
from app.schemas.review_schema import AnalyzeRequest, AnalysisResponse, Finding, PassedCheck

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        # Supported Gemini models
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    async def analyze_content(self, request: AnalyzeRequest) -> Dict[str, Any]:
        """
        Analyze submitted content against brand governance rules.
        Uses Google Gemini API if configured; otherwise gracefully executes
        deterministic governance inspection clearly labeled for testing/evaluation.
        """
        if not self.is_available():
            return self._run_heuristic_governance_engine(
                request,
                model_used="Inkloom Rule Engine [Gemini API Key Not Configured]"
            )

        try:
            prompt = self._build_analysis_prompt(request)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json"
                }
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code != 200:
                    print(f"Gemini API returned status {res.status_code}: {res.text}")
                    return self._run_heuristic_governance_engine(
                        request,
                        model_used=f"Inkloom Rule Engine [Gemini API Error {res.status_code}]"
                    )

                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                cleaned_json = self._extract_json(raw_text)
                parsed = json.loads(cleaned_json)
                parsed["model_used"] = f"Google {self.model_name} (Live)"
                return self._sanitize_response(parsed, request.content)

        except Exception as e:
            print(f"Exception during Gemini API call: {str(e)}")
            return self._run_heuristic_governance_engine(
                request,
                model_used=f"Inkloom Rule Engine [Fallback: {str(e)[:40]}]"
            )

    async def generate_improved_text(self, content: str, finding: Dict[str, Any], brand_name: str, brand_voice: str) -> Dict[str, Any]:
        """
        Generate contextual suggested rewrite preserving voice and facts.
        """
        if not self.is_available():
            # Local replacement
            orig = finding.get("originalText") or finding.get("original_text", "")
            repl = finding.get("suggestedCorrection") or finding.get("suggested_correction", "")
            improved = content.replace(orig, repl) if orig and repl else content
            return {
                "improved_text": improved,
                "explanation": f"Applied verified brand correction: replaced '{orig}' with '{repl}'.",
                "alternatives": [repl] if repl else []
            }

        try:
            prompt = f"""
You are an expert Brand Governance Editor for {brand_name or 'the brand'}.
Tone of Voice: {brand_voice or 'Professional, Authoritative, Trustworthy'}

Issue Found:
Category: {finding.get('category')}
Original Text: "{finding.get('originalText') or finding.get('original_text')}"
Explanation: {finding.get('explanation')}
Suggested Direction: {finding.get('suggestedCorrection') or finding.get('suggested_correction')}

Full Context:
"{content}"

Rewrite the passage to completely resolve this issue while:
1. Preserving the original core message and intent.
2. Maintaining strict adherence to the brand voice.
3. Avoiding any unapproved facts or forbidden claims.

Respond ONLY with a JSON object:
{{
  "improved_text": "full rewritten passage",
  "explanation": "brief reasoning of changes",
  "alternatives": ["alternative 1", "alternative 2"]
}}
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
            }

            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw = data["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(self._extract_json(raw))

        except Exception as e:
            print("Gemini suggestion error:", e)

        # Fallback
        orig = finding.get("originalText") or finding.get("original_text", "")
        repl = finding.get("suggestedCorrection") or finding.get("suggested_correction", "")
        improved = content.replace(orig, repl) if orig and repl else content
        return {
            "improved_text": improved,
            "explanation": "Applied brand correction.",
            "alternatives": []
        }

    def _build_analysis_prompt(self, request: AnalyzeRequest) -> str:
        brand = request.brand
        brand_name = brand.name if brand else "Generic Organization"
        voice = brand.brand_voice if brand else {}
        pref_terms = [t if isinstance(t, str) else f"{t.get('term')} (replace: {t.get('replacementFor')})" for t in (brand.preferred_terms or [])] if brand else []
        rest_terms = [t if isinstance(t, str) else f"{t.get('term')} ({t.get('reason')})" for t in (brand.restricted_terms or [])] if brand else []
        facts = [f if isinstance(f, str) else f"{f.get('fact')} [Source: {f.get('source')}]" for f in (brand.approved_facts or [])] if brand else []
        proh_claims = [c if isinstance(c, str) else f"{c.get('claim')} ({c.get('reason')})" for c in (brand.prohibited_claims or [])] if brand else []
        guidelines_text = "\n".join([g.get('extractedText', '') for g in (brand.guidelines or []) if isinstance(g, dict)]) if brand else ""

        return f"""
You are the Inkloom AI Intelligent Brand Governance Engine.
Your task is to conduct an uncompromising, clinical brand governance review of submitted marketing/communication content against approved organizational brand standards.

=== BRAND PROFILE ===
Brand Name: {brand_name}
Industry: {brand.industry if brand else 'Technology'}
Description: {brand.description if brand else ''}
Brand Voice & Tone: {json.dumps(voice)}
Target Audience: {brand.target_audience if brand else 'Enterprise audience'}

=== PREFERRED TERMINOLOGY ===
{json.dumps(pref_terms, indent=2)}

=== RESTRICTED WORDS & PHRASES (STRICT PROHIBITION) ===
{json.dumps(rest_terms, indent=2)}

=== APPROVED FACTUAL REPOSITORY ===
{json.dumps(facts, indent=2)}

=== PROHIBITED CLAIMS (LEGAL & REGULATORY) ===
{json.dumps(proh_claims, indent=2)}

=== EXTRACTED BRAND GUIDELINES EXCERPTS ===
{guidelines_text[:3000]}

=== SUBMITTED CONTENT FOR REVIEW ===
Title: {request.title}
Content Type: {request.content_type}
Content:
\"\"\"
{request.content}
\"\"\"

=== ANALYSIS RULES ===
1. Tone of Voice: Check if language matches approved tone, formality, and target audience. Flag colloquialisms or hype if inappropriate.
2. Brand Terminology: Detect any restricted terms, prohibited claims, or missing preferred terms.
3. Factual Claims: Verify claims against the Approved Factual Repository.
   CRITICAL GOVERNANCE MANDATE: Never invent brand rules or factual references. If the system cannot verify a claim against available approved sources, mark its verification_status as "Requires Human Verification".
4. Brand Messaging: Detect misleading statements or conflicts with core brand identity.
5. Overall Brand Consistency Score: Calculate an integer score from 0 to 100 based on severity and frequency of issues.
6. Improved Content: Provide a complete, beautifully revised version of the submitted text that resolves all issues while preserving original meaning.

Output strictly valid JSON with this exact schema:
{{
  "consistency_score": 75,
  "summary": "Overall assessment summary sentence.",
  "findings": [
    {{
      "category": "Tone Consistency | Terminology Compliance | Factual Accuracy | Brand Messaging | Visual Guidance",
      "severity": "Critical | Warning | Suggestion",
      "issue": "Concise summary of issue",
      "original_text": "Exact matching substring from content",
      "explanation": "Why this violates brand guidelines",
      "guideline_reference": "Name of guideline or policy section",
      "source_reference": "Source document or repository cited",
      "suggested_correction": "Recommended compliant replacement",
      "verification_status": "Needs Review | Verified Fact | Requires Human Verification | Passed"
    }}
  ],
  "passed_checks": [
    {{
      "rule": "Name of rule",
      "details": "Why it passed"
    }}
  ],
  "warnings": ["Warning notes if any"],
  "improved_content": "Full revised compliant text"
}}
"""

    def _extract_json(self, text: str) -> str:
        text = text.strip()
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if match:
            return match.group(1).strip()
        return text

    def _sanitize_response(self, data: Dict[str, Any], original_content: str) -> Dict[str, Any]:
        if "consistency_score" not in data:
            data["consistency_score"] = 75
        if "findings" not in data or not isinstance(data["findings"], list):
            data["findings"] = []
        if "passed_checks" not in data:
            data["passed_checks"] = []
        if "warnings" not in data:
            data["warnings"] = []
        if "improved_content" not in data or not data["improved_content"]:
            data["improved_content"] = original_content
        return data

    def _run_heuristic_governance_engine(self, request: AnalyzeRequest, model_used: str) -> Dict[str, Any]:
        """
        Deterministic, rule-based governance engine used when Gemini API key is not configured or in offline test mode.
        Thoroughly checks content against supplied brand restrictions, preferred terms, claims, and tone.
        """
        content = request.content
        brand = request.brand
        findings = []
        passed_checks = []
        score = 100
        improved_content = content

        if brand:
            # 1. Restricted terms check
            for item in (brand.restricted_terms or []):
                term = item if isinstance(item, str) else item.get("term", "")
                reason = item.get("reason", "Violates prohibited brand nomenclature") if isinstance(item, dict) else "Violates brand nomenclature"
                if term and re.search(r'\b' + re.escape(term) + r'\b', content, re.IGNORECASE):
                    score -= 20
                    findings.append({
                        "category": "Terminology Compliance",
                        "severity": "Critical",
                        "issue": f"Prohibited brand term detected: '{term}'",
                        "original_text": term,
                        "explanation": reason,
                        "guideline_reference": "Brand Prohibited Terminology Guide",
                        "source_reference": "Official Brand Guidelines",
                        "suggested_correction": "approved corporate phrasing",
                        "verification_status": "Verified Fact"
                    })
                    improved_content = re.sub(r'\b' + re.escape(term) + r'\b', "[Approved Term]", improved_content, flags=re.IGNORECASE)

            # 2. Prohibited claims check
            for item in (brand.prohibited_claims or []):
                claim = item if isinstance(item, str) else item.get("claim", "")
                reason = item.get("reason", "Violates approved legal warranty boundaries") if isinstance(item, dict) else "Violates warranty claims"
                if claim and claim.lower() in content.lower():
                    score -= 25
                    findings.append({
                        "category": "Brand Messaging",
                        "severity": "Critical",
                        "issue": f"Prohibited claim: '{claim}'",
                        "original_text": claim,
                        "explanation": reason,
                        "guideline_reference": "Approved Claims Protocol",
                        "source_reference": "Legal Regulatory Standards",
                        "suggested_correction": "Refer to verified product capabilities in the approved facts library.",
                        "verification_status": "Requires Human Verification"
                    })

            # 3. Preferred terms check
            for item in (brand.preferred_terms or []):
                if isinstance(item, dict):
                    rep = item.get("replacementFor")
                    pref = item.get("term")
                    if rep and pref and re.search(r'\b' + re.escape(rep) + r'\b', content, re.IGNORECASE):
                        score -= 10
                        findings.append({
                            "category": "Terminology Compliance",
                            "severity": "Suggestion",
                            "issue": f"Non-preferred term '{rep}' found; prefer '{pref}'",
                            "original_text": rep,
                            "explanation": f"Brand standards specify using '{pref}' in place of '{rep}'.",
                            "guideline_reference": "Preferred Vocabulary Standard",
                            "source_reference": "Style Guide",
                            "suggested_correction": pref,
                            "verification_status": "Needs Review"
                        })
                        improved_content = re.sub(r'\b' + re.escape(rep) + r'\b', pref, improved_content, flags=re.IGNORECASE)

        # 4. Universal tone & hype checks
        if "!!!" in content or "???" in content:
            score -= 8
            findings.append({
                "category": "Tone Consistency",
                "severity": "Warning",
                "issue": "Excessive exclamation or question marks detected",
                "original_text": "!!!",
                "explanation": "Multiple punctuation marks reduce brand authority and violate professional editorial standards.",
                "guideline_reference": "Editorial Punctuation Standards",
                "source_reference": "Corporate Style Guide",
                "suggested_correction": ".",
                "verification_status": "Needs Review"
            })
            improved_content = re.sub(r'[!]{2,}', '.', improved_content)

        # 5. Check unsupported numerical superlatives
        unverified_patterns = [r'\b100% (?:guarantee|cure|risk-free|protection)\b', r'\bcheapest\b', r'\bworld\'s best\b']
        for pat in unverified_patterns:
            m = re.search(pat, content, re.IGNORECASE)
            if m:
                score -= 15
                findings.append({
                    "category": "Factual Accuracy",
                    "severity": "Critical",
                    "issue": f"Unsubstantiated absolute claim: '{m.group(0)}'",
                    "original_text": m.group(0),
                    "explanation": "Absolute superlatives violate marketing governance without direct audit documentation.",
                    "guideline_reference": "Factual Claim Substantiation Policy",
                    "source_reference": "Compliance Manual",
                    "suggested_correction": "validated high-performance standard",
                    "verification_status": "Requires Human Verification"
                })

        if len(findings) == 0:
            passed_checks.append({"rule": "Restricted Terms Check", "details": "No prohibited keywords found in submitted text."})
            passed_checks.append({"rule": "Claim Compliance", "details": "No unauthorized absolute superlatives detected."})
            passed_checks.append({"rule": "Punctuation & Tone", "details": "Punctuation aligns with professional editorial guidelines."})

        final_score = max(10, min(100, score))
        summary = (
            f"Evaluated content against brand rules. Detected {len(findings)} governance items."
            if findings
            else "Submitted content demonstrated full adherence with active brand parameters."
        )

        return {
            "consistency_score": final_score,
            "summary": summary,
            "findings": findings,
            "passed_checks": passed_checks,
            "warnings": ["Evaluation completed via Inkloom Rule Engine."] if "Not Configured" in model_used else [],
            "improved_content": improved_content,
            "model_used": model_used
        }
