const axios = require('axios');
const BrandProfile = require('../models/BrandProfile');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

// @desc    Direct AI analysis test endpoint
// @route   POST /api/ai/analyze
exports.analyzeContent = async (req, res, next) => {
  try {
    const { content, brandId, contentType, title } = req.body;

    let brand = null;
    if (brandId) {
      brand = await BrandProfile.findById(brandId);
    }

    const payload = {
      content,
      content_type: contentType || 'Marketing Copy',
      title: title || 'Untitled Content',
      brand: brand
        ? {
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
          }
        : null,
    };

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/ai/analyze`, payload, {
        timeout: 30000,
      });
      return res.json({ success: true, data: response.data });
    } catch (aiErr) {
      console.warn('FastAPI service error or timeout:', aiErr.message);
      return res.status(503).json({
        success: false,
        message: 'AI Service currently unavailable',
        error: aiErr.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    AI Suggestion improvement
// @route   POST /api/ai/suggest
exports.suggestContent = async (req, res, next) => {
  try {
    const { content, finding, brandId } = req.body;
    let brand = null;
    if (brandId) {
      brand = await BrandProfile.findById(brandId);
    }

    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/ai/suggest`,
        {
          content,
          finding,
          brand_name: brand?.name,
          brand_voice: brand?.brandVoice?.tone?.join(', '),
        },
        { timeout: 20000 }
      );
      return res.json({ success: true, data: response.data });
    } catch (aiErr) {
      // Local fallback suggestion
      const improved = finding?.suggestedCorrection
        ? content.replace(finding.originalText, finding.suggestedCorrection)
        : content;

      return res.json({
        success: true,
        data: {
          improved_text: improved,
          explanation: finding?.explanation || 'Applied suggested brand correction.',
          fallback_mode: true,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Engine status and configuration
// @route   GET /api/ai/status
exports.getAiStatus = async (req, res, next) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
    res.json({
      success: true,
      serviceAvailable: true,
      data: response.data,
    });
  } catch (err) {
    res.json({
      success: true,
      serviceAvailable: false,
      message: 'FastAPI service offline or starting up',
      error: err.message,
    });
  }
};
