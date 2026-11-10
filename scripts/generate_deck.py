import os
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# Slide Dimensions (16:9 widescreen: 11 x 6.1875 inches -> 792 x 445.5 pt)
PAGE_WIDTH, PAGE_HEIGHT = 792, 445.5

# Palette
PRIMARY = colors.HexColor('#4338CA')     # Deep Indigo
SECONDARY = colors.HexColor('#7C3AED')   # Violet
ACCENT = colors.HexColor('#14B8A6')      # Teal
DARK_BG = colors.HexColor('#0F172A')     # Slate 900
LIGHT_BG = colors.HexColor('#F8FAFC')    # Slate 50
TEXT_MAIN = colors.HexColor('#1E293B')   # Slate 800
TEXT_MUTED = colors.HexColor('#64748B')  # Slate 500
BORDER_COLOR = colors.HexColor('#E2E8F0')# Slate 200
SUCCESS = colors.HexColor('#16A34A')
WARNING = colors.HexColor('#F59E0B')
DANGER = colors.HexColor('#DC2626')
WHITE = colors.white

def draw_header_footer(c, slide_num, title, category="INKLOOM AI • HACKATHON PITCH DECK"):
    # Header line
    c.saveState()
    
    # Top banner background
    c.setFillColor(LIGHT_BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # Top accent line
    c.setFillColor(PRIMARY)
    c.rect(0, PAGE_HEIGHT - 6, PAGE_WIDTH, 6, fill=True, stroke=False)
    
    # Top brand bar
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(SECONDARY)
    c.drawString(40, PAGE_HEIGHT - 28, category.upper())
    
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(TEXT_MAIN)
    c.drawString(40, PAGE_HEIGHT - 50, title)
    
    # Bottom footer line
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(1)
    c.line(40, 30, PAGE_WIDTH - 40, 30)
    
    # Footer text
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, 18, "Inkloom AI – Intelligent Brand Governance Platform • Hackathon Edition")
    c.drawRightString(PAGE_WIDTH - 40, 18, f"Slide {slide_num} of 7")
    c.restoreState()

def create_deck(filename="Inkloom_AI_Pitch_Deck.pdf"):
    c = canvas.Canvas(filename, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    
    # ==========================================================
    # SLIDE 1: COVER SLIDE
    # ==========================================================
    # Dark modern gradient-like hero
    c.setFillColor(DARK_BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # Top glowing accent
    c.setFillColor(PRIMARY)
    c.rect(0, PAGE_HEIGHT - 8, PAGE_WIDTH, 8, fill=True, stroke=False)
    
    # Brand Pill
    c.setFillColor(SECONDARY)
    c.roundRect(40, PAGE_HEIGHT - 75, 230, 24, 6, fill=True, stroke=False)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(WHITE)
    c.drawString(50, PAGE_HEIGHT - 67, "✦ HACKATHON 2026 OFFICIAL DECK")
    
    # Big Title
    c.setFont("Helvetica-Bold", 42)
    c.setFillColor(WHITE)
    c.drawString(40, PAGE_HEIGHT - 135, "INKLOOM AI")
    
    # Subtitle
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(ACCENT)
    c.drawString(40, PAGE_HEIGHT - 165, "Intelligent Brand Governance Platform")
    
    # Value Proposition
    c.setFont("Helvetica-Oblique", 14)
    c.setFillColor(colors.HexColor('#CBD5E1'))
    c.drawString(40, PAGE_HEIGHT - 200, '"Create confidently. Stay consistent. Protect your brand."')
    
    # Divider
    c.setStrokeColor(colors.HexColor('#334155'))
    c.setLineWidth(1)
    c.line(40, PAGE_HEIGHT - 225, PAGE_WIDTH - 40, PAGE_HEIGHT - 225)
    
    # 3 Summary Highlights Cards on Cover
    cards = [
        ("AUTOMATED GOVERNANCE", "Multi-layer brand compliance powered by Google Gemini 2.5 Flash.", PRIMARY),
        ("ZERO HALLUCINATION", "Strict factual repository check flags unverified claims.", SECONDARY),
        ("HUMAN-IN-THE-LOOP", "Certified compliance gate ensuring human editorial approval.", ACCENT),
    ]
    card_w = (PAGE_WIDTH - 80 - 30) / 3
    for i, (head, desc, col) in enumerate(cards):
        x = 40 + i * (card_w + 15)
        y = 70
        c.setFillColor(colors.HexColor('#1E293B'))
        c.roundRect(x, y, card_w, 110, 8, fill=True, stroke=False)
        c.setFillColor(col)
        c.rect(x, y + 106, card_w, 4, fill=True, stroke=False)
        
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(WHITE)
        c.drawString(x + 14, y + 80, head)
        
        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor('#94A3B8'))
        # Simple text wrapping
        words = desc.split()
        line1 = " ".join(words[:5])
        line2 = " ".join(words[5:])
        c.drawString(x + 14, y + 55, line1)
        c.drawString(x + 14, y + 40, line2)
        
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor('#64748B'))
    c.drawString(40, 25, "Live Repo: github.com/Nitesh0517/inkloom-nexus-ai • Production Cloud Hosted on Render")
    c.drawRightString(PAGE_WIDTH - 40, 25, "Slide 1 of 7")
    c.showPage()
    
    # ==========================================================
    # SLIDE 2: THE PROBLEM (GOVERNANCE CRISIS)
    # ==========================================================
    draw_header_footer(c, 2, "The Problem: Why Modern Brand Communication Breaks Down")
    
    # Introduction summary
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, PAGE_HEIGHT - 75, "Organizations publish content through dozens of employees, agencies, copywriters, and autonomous generative AI tools.")
    c.drawString(40, PAGE_HEIGHT - 90, "Without centralized governance, teams accidentally release brand violations that erode public trust and invite regulatory risk.")
    
    problems = [
        ("1. Unapproved Claims & Fact Drift", 
         "Teams accidentally publish outdated statistics, unverified cure rates, or speculative financial warranties that trigger regulatory fines and public backlash.",
         DANGER, "High Legal Risk"),
        ("2. Inconsistent Tone of Voice", 
         "One department sounds sober and institutional while an external agency posts meme-heavy colloquialisms, confusing enterprise buyers and degrading brand prestige.",
         WARNING, "Brand Identity Decay"),
        ("3. Prohibited & Off-Brand Terminology", 
         "Misuse of forbidden nomenclature (e.g. 'AI Doctor' instead of 'Clinical Decision Support'), violating trademark boundaries and medical/financial positioning.",
         PRIMARY, "Compliance Violation"),
        ("4. Manual Editorial Bottlenecks", 
         "Compliance officers drown in endless Slack pings and email threads, leading to either delayed campaign velocity or unchecked rogue publishing.",
         SECONDARY, "Severe Inefficiency"),
    ]
    
    pw = (PAGE_WIDTH - 80 - 20) / 2
    ph = 115
    coords = [
        (40, PAGE_HEIGHT - 230),
        (40 + pw + 20, PAGE_HEIGHT - 230),
        (40, PAGE_HEIGHT - 365),
        (40 + pw + 20, PAGE_HEIGHT - 365),
    ]
    
    for (title, text, col, badge), (x, y) in zip(problems, coords):
        c.setFillColor(WHITE)
        c.roundRect(x, y, pw, ph, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        # Color bar left
        c.setFillColor(col)
        c.roundRect(x, y, 5, ph, 2, fill=True, stroke=False)
        
        # Title
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(TEXT_MAIN)
        c.drawString(x + 18, y + ph - 25, title)
        
        # Badge
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(col)
        c.drawRightString(x + pw - 15, y + ph - 25, badge.upper())
        
        # Text
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        words = text.split()
        lines = []
        cur = []
        for w in words:
            if len(" ".join(cur + [w])) < 58:
                cur.append(w)
            else:
                lines.append(" ".join(cur))
                cur = [w]
        if cur:
            lines.append(" ".join(cur))
            
        for idx, line in enumerate(lines[:3]):
            c.drawString(x + 18, y + ph - 48 - (idx * 14), line)
            
    c.showPage()
    
    # ==========================================================
    # SLIDE 3: THE SOLUTION (INKLOOM AI PLATFORM)
    # ==========================================================
    draw_header_footer(c, 3, "The Solution: Automated Governance with Explainable Oversight")
    
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, PAGE_HEIGHT - 75, "Inkloom AI connects directly to verified organizational guidelines, approved facts, and prohibited claim libraries.")
    c.drawString(40, PAGE_HEIGHT - 90, "Content drafts are automatically evaluated across 5 core dimensions before reaching human reviewers.")
    
    # 5 Pillars
    pillars = [
        ("Tone & Voice Analysis", "Calibrates formality, empathy, and reading grade level for target personas.", PRIMARY),
        ("Brand Terminology", "Identifies restricted words and recommends approved preferred nomenclature.", SECONDARY),
        ("Factual Verification", "Checks claims against verified facts; flags unsupported data as 'Requires Verification'.", ACCENT),
        ("Messaging & Claims", "Detects misleading warranties, speculative yield promises, or compliance breaches.", DANGER),
        ("Visual Brand Guidance", "Cross-references brand imagery and logos against official visual standards.", WARNING),
    ]
    
    col_w = (PAGE_WIDTH - 80 - (4 * 12)) / 5
    for i, (p_title, p_desc, p_col) in enumerate(pillars):
        x = 40 + i * (col_w + 12)
        y = PAGE_HEIGHT - 240
        c.setFillColor(WHITE)
        c.roundRect(x, y, col_w, 130, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        c.setFillColor(p_col)
        c.rect(x, y + 126, col_w, 4, fill=True, stroke=False)
        
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(TEXT_MAIN)
        c.drawString(x + 10, y + 102, p_title.split()[0])
        c.drawString(x + 10, y + 90, " ".join(p_title.split()[1:]))
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        words = p_desc.split()
        lines = []
        cur = []
        for w in words:
            if len(" ".join(cur + [w])) < 22:
                cur.append(w)
            else:
                lines.append(" ".join(cur))
                cur = [w]
        if cur:
            lines.append(" ".join(cur))
        for idx, line in enumerate(lines[:4]):
            c.drawString(x + 10, y + 68 - (idx * 12), line)
            
    # Bottom Callout Box: The Consistency Score
    c.setFillColor(colors.HexColor('#EEF2FF'))
    c.roundRect(40, 48, PAGE_WIDTH - 80, 85, 8, fill=True, stroke=False)
    
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(PRIMARY)
    c.drawString(55, 110, "⚡ THE INKLOOM CONSISTENCY SCORE (0–100)")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MAIN)
    c.drawString(55, 90, "• Instant algorithmic index derived from weighted severity deductions (Critical: -20, Warning: -10, Suggestion: -5).")
    c.drawString(55, 75, "• Radial color-coded visual indicator with clear breakdown: Critical Violations, Warnings, Suggestions & Passed Checks.")
    c.drawString(55, 60, "• Enterprise benchmark: Submissions below 70% threshold are gated from publication until corrections are applied.")
    
    c.showPage()
    
    # ==========================================================
    # SLIDE 4: CORE PRODUCT FEATURES & INNOVATION
    # ==========================================================
    draw_header_footer(c, 4, "Key Features: Explainable Diagnostics & One-Click Suggestion Engine")
    
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, PAGE_HEIGHT - 75, "Inkloom AI bridges the gap between raw AI generation and audit-ready corporate compliance.")
    
    # 3 Feature Showcase Cards
    feats = [
        ("EXPLAINABLE AI DIAGNOSTICS", 
         "Every flagged issue includes:",
         ["• Exact flagged text snippet highlighted", 
          "• Clear explanation of the violation",
          "• Cited brand guideline & source document",
          "• Severity classification (Critical / Warning)"],
         PRIMARY),
        ("ONE-CLICK SUGGESTION ENGINE", 
         "Contextual rewrite capabilities:",
         ["• Side-by-side comparison (Original vs Improved)", 
          "• Preserves marketing intent & brand voice",
          "• 4 action buttons: Apply, Dismiss, Edit, Regenerate",
          "• Replaces text seamlessly in draft"],
         SECONDARY),
        ("MULTI-FORMAT GUIDELINE REPOSITORY", 
         "Enterprise document ingestion:",
         ["• Upload PDF, DOCX, and TXT style guides", 
          "• Automatic text parsing & index extraction",
          "• Active brand switching (Healthcare & FinTech)",
          "• Verified facts & prohibited claim catalogs"],
         ACCENT),
    ]
    
    fw = (PAGE_WIDTH - 80 - 24) / 3
    fh = 245
    for i, (title, sub, bullet_list, col) in enumerate(feats):
        x = 40 + i * (fw + 12)
        y = 65
        c.setFillColor(WHITE)
        c.roundRect(x, y, fw, fh, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        c.setFillColor(col)
        c.roundRect(x, y + fh - 32, fw, 32, 8, fill=True, stroke=False)
        c.rect(x, y + fh - 32, fw, 10, fill=True, stroke=False)
        
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(WHITE)
        c.drawString(x + 12, y + fh - 20, title)
        
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_MAIN)
        c.drawString(x + 12, y + fh - 50, sub)
        
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        for idx, bullet in enumerate(bullet_list):
            c.drawString(x + 12, y + fh - 75 - (idx * 24), bullet)
            
    c.showPage()
    
    # ==========================================================
    # SLIDE 5: HUMAN-IN-THE-LOOP APPROVAL WORKFLOW
    # ==========================================================
    draw_header_footer(c, 5, "Human-in-the-Loop Workflow: Certified Editorial Accountability")
    
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, PAGE_HEIGHT - 75, "AI provides diagnostic guidance; human compliance officers make certified publishing decisions.")
    
    # Workflow Steps
    steps = [
        ("Step 1", "Draft Submitted", "Creator pastes text or uploads draft across channels (email, social, ads).", PRIMARY),
        ("Step 2", "Gemini AI Audit", "Scans text against brand voice, prohibited words, and approved facts in seconds.", SECONDARY),
        ("Step 3", "Reviewer Queue", "Flagged content routes to authorized Compliance Officer dashboard.", ACCENT),
        ("Step 4", "Human Decision", "Officer inspects original vs improved text, adds notes, and issues determination.", SUCCESS),
    ]
    
    sw = (PAGE_WIDTH - 80 - 36) / 4
    for i, (st, sname, sdesc, scol) in enumerate(steps):
        x = 40 + i * (sw + 12)
        y = PAGE_HEIGHT - 215
        c.setFillColor(WHITE)
        c.roundRect(x, y, sw, 105, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(scol)
        c.drawString(x + 12, y + 85, st.upper())
        
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(TEXT_MAIN)
        c.drawString(x + 12, y + 68, sname)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        words = sdesc.split()
        lines = []
        cur = []
        for w in words:
            if len(" ".join(cur + [w])) < 26:
                cur.append(w)
            else:
                lines.append(" ".join(cur))
                cur = [w]
        if cur:
            lines.append(" ".join(cur))
        for idx, line in enumerate(lines[:3]):
            c.drawString(x + 12, y + 46 - (idx * 12), line)
            
    # Decision Status Badges Row
    c.setFillColor(WHITE)
    c.roundRect(40, 50, PAGE_WIDTH - 80, 115, 8, fill=True, stroke=True)
    c.setStrokeColor(BORDER_COLOR)
    
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(TEXT_MAIN)
    c.drawString(55, 140, "Official Human Determination States:")
    
    statuses = [
        ("APPROVED", "Content satisfies all guidelines and is certified for public distribution.", SUCCESS),
        ("CHANGES REQUESTED", "Specific violations flagged for creator revision before reconsideration.", WARNING),
        ("REJECTED", "Content fundamentally violates legal boundaries or brand positioning.", DANGER),
    ]
    
    stat_w = (PAGE_WIDTH - 80 - 60) / 3
    for i, (s_title, s_sub, s_col) in enumerate(statuses):
        x = 55 + i * (stat_w + 15)
        y = 65
        c.setFillColor(s_col)
        c.roundRect(x, y + 42, 100, 18, 4, fill=True, stroke=False)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(WHITE)
        c.drawString(x + 8, y + 47, s_title)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        words = s_sub.split()
        l1 = " ".join(words[:6])
        l2 = " ".join(words[6:])
        c.drawString(x, y + 25, l1)
        c.drawString(x, y + 12, l2)
        
    c.showPage()
    
    # ==========================================================
    # SLIDE 6: TECHNICAL ARCHITECTURE & STACK
    # ==========================================================
    draw_header_footer(c, 6, "Technology Stack & Production Cloud Deployment")
    
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, PAGE_HEIGHT - 75, "Engineered with modern, scalable, and resilient enterprise cloud infrastructure.")
    
    stack_cols = [
        ("FRONTEND", [
            ("Framework", "React 18 + Vite"),
            ("Styling", "Tailwind CSS"),
            ("Visuals", "Recharts & Lucide Icons"),
            ("State", "React Context (Auth & Brand)"),
            ("Routing", "React Router DOM v6 SPA"),
            ("Hosting", "Render Static Site (Live)"),
        ], PRIMARY),
        ("BACKEND API", [
            ("Runtime", "Node.js (v24 LTS)"),
            ("Framework", "Express.js REST APIs"),
            ("Database", "MongoDB & Mongoose"),
            ("Authentication", "Firebase Auth + JWT"),
            ("Document Engine", "Multer Ingestion Gateway"),
            ("Hosting", "Render Web Service"),
        ], SECONDARY),
        ("AI SERVICE", [
            ("Language", "Python 3.14"),
            ("Framework", "FastAPI + Uvicorn ASGI"),
            ("LLM Engine", "Google Gemini 2.5 Flash"),
            ("Doc Extract", "PyPDF & python-docx"),
            ("Fail-Safe", "Deterministic Rule Engine"),
            ("Output Mode", "Strict JSON Schema"),
        ], ACCENT),
    ]
    
    tw = (PAGE_WIDTH - 80 - 24) / 3
    for i, (col_name, rows, col) in enumerate(stack_cols):
        x = 40 + i * (tw + 12)
        y = 55
        c.setFillColor(WHITE)
        c.roundRect(x, y, tw, 255, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        c.setFillColor(col)
        c.roundRect(x, y + 255 - 30, tw, 30, 8, fill=True, stroke=False)
        c.rect(x, y + 255 - 30, tw, 10, fill=True, stroke=False)
        
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(WHITE)
        c.drawString(x + 12, y + 255 - 19, col_name)
        
        for r_idx, (lbl, val) in enumerate(rows):
            ry = y + 255 - 60 - (r_idx * 33)
            c.setFont("Helvetica-Bold", 8.5)
            c.setFillColor(TEXT_MAIN)
            c.drawString(x + 12, ry + 10, lbl)
            c.setFont("Helvetica", 8)
            c.setFillColor(TEXT_MUTED)
            c.drawString(x + 12, ry - 3, val)
            if r_idx < len(rows) - 1:
                c.setStrokeColor(colors.HexColor('#F1F5F9'))
                c.line(x + 12, ry - 8, x + tw - 12, ry - 8)
                
    c.showPage()
    
    # ==========================================================
    # SLIDE 7: BUSINESS IMPACT, TRACTION & ROADMAP
    # ==========================================================
    draw_header_footer(c, 7, "Business Value, ROI & Strategic Roadmap")
    
    # 3 Key Metric Cards
    metrics = [
        ("78%", "Faster Review Cycles", "Eliminates manual editorial ping-pong with instant guideline diagnostics.", PRIMARY),
        ("0%", "Unsubstantiated Claims", "Factual repository enforcement prevents deceptive claims before publishing.", SUCCESS),
        ("100%", "Human Accountability", "Every live release has certified, timestamped human reviewer sign-off.", SECONDARY),
    ]
    
    mw = (PAGE_WIDTH - 80 - 24) / 3
    for i, (stat, title, sub, col) in enumerate(metrics):
        x = 40 + i * (mw + 12)
        y = PAGE_HEIGHT - 175
        c.setFillColor(WHITE)
        c.roundRect(x, y, mw, 85, 8, fill=True, stroke=True)
        c.setStrokeColor(BORDER_COLOR)
        
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(col)
        c.drawString(x + 14, y + 50, stat)
        
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(TEXT_MAIN)
        c.drawString(x + 14, y + 32, title)
        
        c.setFont("Helvetica", 7.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(x + 14, y + 16, sub[:48] + "...")
        
    # Strategic Roadmap Box
    c.setFillColor(WHITE)
    c.roundRect(40, 50, PAGE_WIDTH - 80, 170, 8, fill=True, stroke=True)
    c.setStrokeColor(BORDER_COLOR)
    
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT_MAIN)
    c.drawString(55, 195, "Strategic Product Roadmap:")
    
    roadmap = [
        ("Phase 1: Foundation (Current Hackathon MVP)", "Full-stack SaaS, multi-brand repository, Gemini 2.5 Flash analysis, and human approval queue.", SUCCESS),
        ("Phase 2: Omnichannel CMS Connectors", "Direct publishing integrations for WordPress, HubSpot, Webflow, and LinkedIn API.", PRIMARY),
        ("Phase 3: Real-Time Browser Extension Copilot", "Chrome DevTools & sidecar extension flagging brand compliance directly inside Google Docs and Notion.", SECONDARY),
        ("Phase 4: Multimodal Visual & Audio Governance", "Detect logo safety margins, brand color deviations, and audio podcast voiceover compliance.", ACCENT),
    ]
    
    for r_idx, (r_title, r_desc, r_col) in enumerate(roadmap):
        ry = 168 - (r_idx * 32)
        c.setFillColor(r_col)
        c.circle(62, ry + 4, 4, fill=True, stroke=False)
        
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_MAIN)
        c.drawString(75, ry, r_title)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawString(75, ry - 11, r_desc)
        
    c.showPage()
    
    c.save()
    print(f"✅ Generated 7-slide PDF: {filename}")

if __name__ == "__main__":
    create_deck("Inkloom_AI_7_Page_Pitch_Deck.pdf")
