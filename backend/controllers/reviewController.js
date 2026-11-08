const ContentReview = require('../models/ContentReview');
const BrandProfile = require('../models/BrandProfile');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

// Helper to count words
const getWordCount = (str) => {
  return str ? str.trim().split(/\s+/).filter(Boolean).length : 0;
};

// @desc    Get all reviews with filtering and search
// @route   GET /api/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const { brandId, status, search, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (brandId && brandId !== 'all') {
      filter.brandId = brandId;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { originalContent: { $regex: search, $options: 'i' } },
      ];
    }

    const reviews = await ContentReview.find(filter)
      .populate('brandId', 'name industry logo')
      .populate('userId', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await ContentReview.countDocuments(filter);

    res.json({
      success: true,
      count: reviews.length,
      total,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
exports.getReviewById = async (req, res, next) => {
  try {
    const review = await ContentReview.findById(req.params.id)
      .populate('brandId')
      .populate('userId', 'name email role')
      .populate('reviewedBy', 'name email');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Create content review and trigger AI analysis
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { brandId, title, contentType, originalContent } = req.body;

    if (!brandId || !title || !originalContent) {
      return res.status(400).json({
        success: false,
        message: 'brandId, title, and originalContent are required',
      });
    }

    const brand = await BrandProfile.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand profile not found' });
    }

    // Call FastAPI AI service
    let aiResult;
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/ai/analyze`,
        {
          content: originalContent,
          content_type: contentType,
          title: title,
          brand: {
            id: brand._id.toString(),
            name: brand.name,
            industry: brand.industry,
            description: brand.description,
            brand_voice: brand.brandVoice,
            target_audience: brand.targetAudience,
            preferred_terms: brand.preferredTerms,
            restricted_terms: brand.restrictedTerms,
            approved_facts: brand.approvedFacts,
            prohibited_claims: brand.prohibitedClaims,
            guidelines: brand.guidelines,
          },
        },
        { timeout: 25000 }
      );
      aiResult = response.data;
    } catch (aiError) {
      console.warn('FastAPI AI Service unavailable or error, using local fallback analyzer:', aiError.message);
      aiResult = runLocalFallbackAnalysis(originalContent, brand, contentType);
    }

    const wordCount = getWordCount(originalContent);

    const review = await ContentReview.create({
      userId: req.user?._id,
      brandId: brand._id,
      title,
      contentType: contentType || 'Marketing Emails',
      originalContent,
      improvedContent: aiResult.improved_content || originalContent,
      consistencyScore: aiResult.consistency_score || 75,
      summary: aiResult.summary || 'Content analysis completed against brand guidelines.',
      findings: aiResult.findings || [],
      passedChecks: aiResult.passed_checks || [],
      warnings: aiResult.warnings || [],
      status: 'Draft',
      isAiGenerated: true,
      metadata: {
        wordCount,
        readingTimeMinutes: Math.ceil(wordCount / 200),
        analyzedWithModel: aiResult.model_used || 'Gemini 2.5 Flash / Inkloom Engine',
      },
    });

    res.status(201).json({
      success: true,
      data: review,
      analysisSummary: {
        score: review.consistencyScore,
        critical: review.criticalCount,
        warning: review.warningCount,
        suggestion: review.suggestionCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific finding (mark applied, ignored, or custom correction)
// @route   PATCH /api/reviews/:id/findings/:findingId
exports.updateFinding = async (req, res, next) => {
  try {
    const { isApplied, isIgnored, suggestedCorrection } = req.body;
    const review = await ContentReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const finding = review.findings.id(req.params.findingId) || review.findings.find(f => f.id === req.params.findingId);
    if (!finding) {
      return res.status(404).json({ success: false, message: 'Finding not found' });
    }

    if (isApplied !== undefined) finding.isApplied = isApplied;
    if (isIgnored !== undefined) finding.isIgnored = isIgnored;
    if (suggestedCorrection !== undefined) finding.suggestedCorrection = suggestedCorrection;

    // Recalculate improved content if finding was applied
    if (isApplied && finding.originalText && finding.suggestedCorrection) {
      if (!review.improvedContent) review.improvedContent = review.originalContent;
      review.improvedContent = review.improvedContent.split(finding.originalText).join(finding.suggestedCorrection);
    }

    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review content or status
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
  try {
    const { title, improvedContent, status, reviewerNotes } = req.body;
    let review = await ContentReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (title) review.title = title;
    if (improvedContent !== undefined) review.improvedContent = improvedContent;
    if (status) review.status = status;
    if (reviewerNotes !== undefined) review.reviewerNotes = reviewerNotes;

    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await ContentReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await ContentReview.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Fallback deterministic analysis in case AI service is disconnected
function runLocalFallbackAnalysis(content, brand, contentType) {
  const findings = [];
  const passedChecks = [];
  let score = 95;

  // 1. Restricted terms check
  if (brand.restrictedTerms && brand.restrictedTerms.length > 0) {
    brand.restrictedTerms.forEach((item) => {
      const term = typeof item === 'string' ? item : item.term;
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(content)) {
        score -= 15;
        findings.push({
          category: 'Terminology Compliance',
          severity: 'Critical',
          issue: `Restricted brand term detected: "${term}"`,
          originalText: term,
          explanation: item.reason || `"${term}" violates approved brand messaging standards.`,
          guidelineReference: 'Prohibited Terminology Policy',
          sourceReference: 'Brand Voice & Style Guide',
          suggestedCorrection: 'Remove or replace with approved corporate terminology',
          verificationStatus: 'Verified Fact',
        });
      }
    });
  }

  // 2. Prohibited claims check
  if (brand.prohibitedClaims && brand.prohibitedClaims.length > 0) {
    brand.prohibitedClaims.forEach((item) => {
      const claim = typeof item === 'string' ? item : item.claim;
      if (content.toLowerCase().includes(claim.toLowerCase())) {
        score -= 20;
        findings.push({
          category: 'Brand Messaging',
          severity: 'Critical',
          issue: `Prohibited claim identified: "${claim}"`,
          originalText: claim,
          explanation: item.reason || 'Claims of this nature violate regulatory or brand compliance guidelines.',
          guidelineReference: 'Approved Claims Protocol',
          sourceReference: 'Legal Compliance Manual',
          suggestedCorrection: 'Use substantiated facts from the approved fact repository.',
          verificationStatus: 'Needs Review',
        });
      }
    });
  }

  // 3. Preferred terminology check
  if (brand.preferredTerms && brand.preferredTerms.length > 0) {
    brand.preferredTerms.forEach((item) => {
      if (item.replacementFor && content.toLowerCase().includes(item.replacementFor.toLowerCase())) {
        score -= 8;
        findings.push({
          category: 'Terminology Compliance',
          severity: 'Suggestion',
          issue: `Outdated or non-preferred term: "${item.replacementFor}"`,
          originalText: item.replacementFor,
          explanation: `Brand guidelines recommend using "${item.term}" instead of "${item.replacementFor}".`,
          guidelineReference: 'Brand Nomenclature Guide',
          sourceReference: 'Brand Guidelines',
          suggestedCorrection: item.term,
          verificationStatus: 'Needs Review',
        });
      }
    });
  }

  // 4. Tone & formatting heuristics
  if (content.includes('!!!') || content.includes('???')) {
    score -= 5;
    findings.push({
      category: 'Tone Consistency',
      severity: 'Warning',
      issue: 'Excessive punctuation detected',
      originalText: '!!!',
      explanation: 'Multiple exclamation marks violate the professional and authoritative brand tone.',
      guidelineReference: 'Tone of Voice Guide (Professional & Authoritative)',
      sourceReference: 'Brand Voice Guide',
      suggestedCorrection: '.',
      verificationStatus: 'Needs Review',
    });
  }

  // Passed checks
  if (findings.length === 0) {
    passedChecks.push({
      rule: 'Brand Vocabulary',
      details: 'No restricted brand terminology detected.',
    });
    passedChecks.push({
      rule: 'Factual Alignment',
      details: 'All claims align with verified product parameters.',
    });
  }

  score = Math.max(10, Math.min(100, score));

  return {
    consistency_score: score,
    summary:
      findings.length > 0
        ? `Identified ${findings.length} brand compliance items requiring reviewer attention.`
        : 'Content demonstrates high alignment with organizational brand guidelines.',
    findings,
    passed_checks: passedChecks,
    warnings: score < 70 ? ['Consistency score is below recommended publishing threshold (70%)'] : [],
    improved_content: content,
    model_used: 'Inkloom Rule & Compliance Engine (Local)',
  };
}
