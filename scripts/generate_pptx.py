import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_pptx(filename="Inkloom_AI_7_Page_Pitch_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    PRIMARY = RGBColor(67, 56, 202)    # #4338CA
    SECONDARY = RGBColor(124, 58, 237) # #7C3AED
    ACCENT = RGBColor(20, 184, 166)    # #14B8A6
    DARK_BG = RGBColor(15, 23, 42)     # #0F172A
    CARD_BG = RGBColor(255, 255, 255)
    TEXT_MAIN = RGBColor(30, 41, 59)
    TEXT_MUTED = RGBColor(100, 116, 139)
    LIGHT_BG = RGBColor(248, 250, 252)
    
    blank_layout = prs.slide_layouts[6]
    
    # Helper to add standard header/footer
    def setup_slide(slide, title, category="INKLOOM AI • HACKATHON PITCH DECK", slide_num=1):
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = LIGHT_BG
        bg.line.fill.background()
        
        # Top banner
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = PRIMARY
        top_bar.line.fill.background()
        
        # Category
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8), Inches(0.4))
        tf = tx_box.text_frame
        tf.text = category
        tf.paragraphs[0].font.size = Pt(11)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.color.rgb = SECONDARY
        
        # Title
        tx_box2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.7))
        tf2 = tx_box2.text_frame
        tf2.text = title
        tf2.paragraphs[0].font.size = Pt(22)
        tf2.paragraphs[0].font.bold = True
        tf2.paragraphs[0].font.color.rgb = TEXT_MAIN
        
        # Footer
        ft_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.5), Inches(0.4))
        ft_tf = ft_box.text_frame
        ft_p = ft_tf.paragraphs[0]
        ft_p.text = f"Inkloom AI – Intelligent Brand Governance Platform • Slide {slide_num} of 7"
        ft_p.font.size = Pt(10)
        ft_p.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 1: COVER
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_BG
    bg1.line.fill.background()
    
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.15))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY
    top_bar.line.fill.background()
    
    tx = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11), Inches(4.5))
    tf = tx.text_frame
    
    p0 = tf.paragraphs[0]
    p0.text = "✦ HACKATHON 2026 OFFICIAL DECK"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = SECONDARY
    p0.space_after = Pt(20)
    
    p1 = tf.add_paragraph()
    p1.text = "INKLOOM AI"
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    
    p2 = tf.add_paragraph()
    p2.text = "Intelligent Brand Governance Platform"
    p2.font.size = Pt(26)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT
    p2.space_after = Pt(24)
    
    p3 = tf.add_paragraph()
    p3.text = '"Create confidently. Stay consistent. Protect your brand."'
    p3.font.size = Pt(18)
    p3.font.italic = True
    p3.font.color.rgb = RGBColor(203, 213, 225)
    
    ft1 = slide1.shapes.add_textbox(Inches(1.0), Inches(6.6), Inches(11), Inches(0.5))
    ft1_p = ft1.text_frame.paragraphs[0]
    ft1_p.text = "Live Repository: github.com/Nitesh0517/inkloom-nexus-ai • Production Hosted on Render"
    ft1_p.font.size = Pt(11)
    ft1_p.font.color.rgb = RGBColor(148, 163, 184)
    
    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    setup_slide(slide2, "The Problem: Why Modern Brand Communication Breaks Down", slide_num=2)
    
    problems = [
        ("1. Unapproved Claims & Fact Drift", "Teams accidentally publish outdated statistics, unverified cure rates, or speculative financial warranties that trigger regulatory fines and public backlash."),
        ("2. Inconsistent Tone of Voice", "One department sounds sober and institutional while an external agency posts meme-heavy colloquialisms, confusing enterprise buyers and degrading brand prestige."),
        ("3. Prohibited & Off-Brand Terminology", "Misuse of forbidden nomenclature (e.g. 'AI Doctor' instead of 'Clinical Decision Support'), violating trademark boundaries and regulatory positioning."),
        ("4. Manual Editorial Bottlenecks", "Compliance officers drown in endless Slack pings and email threads, leading to either delayed campaign velocity or unchecked rogue publishing."),
    ]
    
    for i, (p_title, p_desc) in enumerate(problems):
        row = i // 2
        col = i % 2
        left = Inches(1.0 + col * 5.8)
        top = Inches(1.8 + row * 2.4)
        
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.4), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide2.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), Inches(5.0), Inches(1.7))
        tf = tx.text_frame
        p_head = tf.paragraphs[0]
        p_head.text = p_title
        p_head.font.size = Pt(14)
        p_head.font.bold = True
        p_head.font.color.rgb = PRIMARY
        p_head.space_after = Pt(8)
        
        p_body = tf.add_paragraph()
        p_body.text = p_desc
        p_body.font.size = Pt(11)
        p_body.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 3: THE SOLUTION
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    setup_slide(slide3, "The Solution: Automated Governance with Explainable Oversight", slide_num=3)
    
    pillars = [
        ("Tone & Voice Analysis", "Calibrates formality, empathy, and reading grade level for target audiences."),
        ("Brand Terminology", "Identifies restricted words and recommends approved preferred nomenclature."),
        ("Factual Verification", "Checks claims against verified facts; flags unsupported data for human review."),
        ("Messaging & Claims", "Detects misleading warranties, speculative yield promises, or compliance breaches."),
        ("Visual Brand Guidance", "Cross-references brand imagery and logos against official visual standards."),
    ]
    
    for i, (p_title, p_desc) in enumerate(pillars):
        left = Inches(0.8 + i * 2.4)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.2), Inches(3.2))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide3.shapes.add_textbox(left + Inches(0.15), Inches(1.95), Inches(1.9), Inches(2.8))
        tf = tx.text_frame
        p_h = tf.paragraphs[0]
        p_h.text = p_title
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = PRIMARY
        p_h.space_after = Pt(10)
        
        p_b = tf.add_paragraph()
        p_b.text = p_desc
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = TEXT_MUTED
        
    # Score Callout
    callout = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.2), Inches(11.8), Inches(1.4))
    callout.fill.solid()
    callout.fill.fore_color.rgb = RGBColor(238, 242, 255)
    callout.line.color.rgb = PRIMARY
    
    tx = slide3.shapes.add_textbox(Inches(1.0), Inches(5.3), Inches(11.4), Inches(1.2))
    tf = tx.text_frame
    p0 = tf.paragraphs[0]
    p0.text = "⚡ THE INKLOOM CONSISTENCY SCORE (0–100)"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = PRIMARY
    p0.space_after = Pt(4)
    
    p1 = tf.add_paragraph()
    p1.text = "• Instant algorithmic index derived from weighted severity deductions (Critical: -20, Warning: -10, Suggestion: -5).\n• Submissions below 70% threshold are gated from publication until approved corrections are applied."
    p1.font.size = Pt(10)
    p1.font.color.rgb = TEXT_MAIN

    # -------------------------------------------------------------
    # SLIDE 4: KEY FEATURES
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    setup_slide(slide4, "Key Features: Explainable Diagnostics & One-Click Suggestion Engine", slide_num=4)
    
    feats = [
        ("Explainable AI Diagnostics", "Every flagged issue includes:\n• Exact flagged text highlighted\n• Clear explanation of the violation\n• Cited brand guideline & source\n• Severity rating (Critical/Warning)"),
        ("One-Click Suggestion Engine", "Contextual rewrite capabilities:\n• Side-by-side comparison mode\n• Preserves intent & voice\n• 4 actions: Apply, Dismiss, Edit, Regenerate\n• Direct drop-in replacements"),
        ("Multi-Format Guideline Repository", "Enterprise document ingestion:\n• Upload PDF, DOCX, and TXT guides\n• Automatic text parsing & index extraction\n• Multi-brand workspaces\n• Approved factual claim repository"),
    ]
    
    for i, (f_title, f_desc) in enumerate(feats):
        left = Inches(1.0 + i * 4.0)
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.6), Inches(4.7))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide4.shapes.add_textbox(left + Inches(0.2), Inches(2.0), Inches(3.2), Inches(4.3))
        tf = tx.text_frame
        p_h = tf.paragraphs[0]
        p_h.text = f_title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = SECONDARY
        p_h.space_after = Pt(14)
        
        for line in f_desc.split("\n"):
            p_l = tf.add_paragraph()
            p_l.text = line
            p_l.font.size = Pt(11)
            p_l.font.color.rgb = TEXT_MAIN
            p_l.space_after = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 5: HUMAN-IN-THE-LOOP APPROVAL
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    setup_slide(slide5, "Human-in-the-Loop Workflow: Certified Editorial Accountability", slide_num=5)
    
    steps = [
        ("Step 1: Draft Submitted", "Creator pastes text or uploads draft across marketing channels."),
        ("Step 2: Gemini AI Audit", "Scans text against voice, prohibited words, and approved facts."),
        ("Step 3: Reviewer Queue", "Flagged content routes to authorized Compliance Officer dashboard."),
        ("Step 4: Human Sign-Off", "Officer inspects original vs improved text and issues certified determination."),
    ]
    
    for i, (s_title, s_desc) in enumerate(steps):
        left = Inches(1.0 + i * 2.9)
        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.6), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide5.shapes.add_textbox(left + Inches(0.15), Inches(1.95), Inches(2.3), Inches(2.0))
        tf = tx.text_frame
        p_h = tf.paragraphs[0]
        p_h.text = s_title
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = PRIMARY
        p_h.space_after = Pt(8)
        
        p_b = tf.add_paragraph()
        p_b.text = s_desc
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = TEXT_MUTED
        
    status_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.5), Inches(11.3), Inches(2.0))
    status_box.fill.solid()
    status_box.fill.fore_color.rgb = CARD_BG
    status_box.line.color.rgb = RGBColor(226, 232, 240)
    
    tx = slide5.shapes.add_textbox(Inches(1.2), Inches(4.6), Inches(10.9), Inches(1.8))
    tf = tx.text_frame
    p0 = tf.paragraphs[0]
    p0.text = "Official Compliance Decision States:"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = TEXT_MAIN
    p0.space_after = Pt(8)
    
    p1 = tf.add_paragraph()
    p1.text = "• APPROVED: Content satisfies all corporate guidelines and is certified for public publication.\n• CHANGES REQUESTED: Specific infractions flagged with notes for creator revisions.\n• REJECTED: Content violates regulatory policy or brand guidelines and is blocked from release."
    p1.font.size = Pt(11)
    p1.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 6: TECHNICAL ARCHITECTURE
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    setup_slide(slide6, "Technology Stack & Production Cloud Deployment", slide_num=6)
    
    stack = [
        ("Frontend Client", "• React 18 + Vite\n• Tailwind CSS\n• Recharts Visualizations\n• Lucide React Icons\n• React Router DOM v6\n• Deployed on Render Static Site"),
        ("Backend REST API", "• Node.js (v24 LTS)\n• Express.js REST Framework\n• MongoDB & Mongoose Store\n• Firebase Auth + Signed JWT\n• Multer Document Ingestion\n• Deployed on Render Web Service"),
        ("AI Microservice", "• Python 3.14 + FastAPI\n• Uvicorn ASGI Server\n• Google Gemini 2.5 Flash\n• PyPDF & python-docx Extraction\n• Deterministic Rule Engine Fallback\n• Strict JSON Schema Enforcement"),
    ]
    
    for i, (col_title, col_items) in enumerate(stack):
        left = Inches(1.0 + i * 4.0)
        card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.6), Inches(4.7))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide6.shapes.add_textbox(left + Inches(0.2), Inches(2.0), Inches(3.2), Inches(4.3))
        tf = tx.text_frame
        p_h = tf.paragraphs[0]
        p_h.text = col_title
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = PRIMARY
        p_h.space_after = Pt(14)
        
        for item in col_items.split("\n"):
            p_i = tf.add_paragraph()
            p_i.text = item
            p_i.font.size = Pt(11)
            p_i.font.color.rgb = TEXT_MAIN
            p_i.space_after = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 7: BUSINESS IMPACT & ROADMAP
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    setup_slide(slide7, "Business Value, ROI & Strategic Roadmap", slide_num=7)
    
    metrics = [
        ("78%", "Faster Review Cycles", "Instant automated guideline diagnostics eliminate manual back-and-forth."),
        ("0%", "Unsubstantiated Claims", "Factual repository enforcement prevents deceptive claims before publishing."),
        ("100%", "Human Accountability", "Every release is backed by a certified human reviewer audit log."),
    ]
    
    for i, (val, title, desc) in enumerate(metrics):
        left = Inches(1.0 + i * 4.0)
        card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.6), Inches(2.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(226, 232, 240)
        
        tx = slide7.shapes.add_textbox(left + Inches(0.2), Inches(1.9), Inches(3.2), Inches(1.8))
        tf = tx.text_frame
        p_v = tf.paragraphs[0]
        p_v.text = val
        p_v.font.size = Pt(28)
        p_v.font.bold = True
        p_v.font.color.rgb = SECONDARY
        
        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN
        p_t.space_after = Pt(4)
        
        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_MUTED
        
    road_box = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.1), Inches(11.3), Inches(2.5))
    road_box.fill.solid()
    road_box.fill.fore_color.rgb = CARD_BG
    road_box.line.color.rgb = RGBColor(226, 232, 240)
    
    tx = slide7.shapes.add_textbox(Inches(1.2), Inches(4.2), Inches(10.9), Inches(2.3))
    tf = tx.text_frame
    p0 = tf.paragraphs[0]
    p0.text = "Strategic Product Roadmap:"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = PRIMARY
    p0.space_after = Pt(8)
    
    roadmap = [
        ("Phase 1: Foundation (Current Hackathon MVP)", "Full-stack SaaS, multi-brand repository, Gemini 2.5 Flash analysis, and human approval queue."),
        ("Phase 2: Omnichannel CMS Connectors", "Direct publishing integrations for WordPress, HubSpot, Webflow, and LinkedIn API."),
        ("Phase 3: Real-Time Browser Extension Copilot", "Chrome DevTools & sidecar extension flagging brand compliance directly inside Google Docs and Notion."),
        ("Phase 4: Multimodal Visual & Audio Governance", "Detect logo safety margins, brand color deviations, and audio podcast voiceover compliance."),
    ]
    for r_title, r_desc in roadmap:
        p = tf.add_paragraph()
        p.text = f"• {r_title}: {r_desc}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(4)
        
    prs.save(filename)
    print(f"✅ Generated 7-slide PPTX: {filename}")

if __name__ == "__main__":
    create_pptx("Inkloom_AI_7_Page_Pitch_Deck.pptx")
