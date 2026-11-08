const BrandProfile = require('../models/BrandProfile');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

// @desc    Get all brand profiles
// @route   GET /api/brands
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await BrandProfile.find().sort({ createdAt: -1 });
    res.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single brand profile by ID
// @route   GET /api/brands/:id
exports.getBrandById = async (req, res, next) => {
  try {
    const brand = await BrandProfile.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand profile not found' });
    }
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new brand profile
// @route   POST /api/brands
exports.createBrand = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      description,
      industry,
      mission,
      brandVoice,
      targetAudience,
      preferredTerms,
      restrictedTerms,
      approvedFacts,
      prohibitedClaims,
      guidelines,
      assets,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    const brand = await BrandProfile.create({
      ownerId: req.user?._id,
      name,
      tagline: tagline || '',
      description,
      industry: industry || 'Technology',
      mission: mission || '',
      brandVoice: brandVoice || {
        tone: ['Professional', 'Authoritative', 'Trustworthy'],
        formality: 'Semi-Formal',
        dos: [],
        donts: [],
        readingLevel: 'General Public (Grade 9-12)',
      },
      targetAudience: targetAudience || 'General audience',
      preferredTerms: preferredTerms || [],
      restrictedTerms: restrictedTerms || [],
      approvedFacts: approvedFacts || [],
      prohibitedClaims: prohibitedClaims || [],
      guidelines: guidelines || [],
      assets: assets || [],
    });

    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand profile
// @route   PUT /api/brands/:id
exports.updateBrand = async (req, res, next) => {
  try {
    let brand = await BrandProfile.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand profile not found' });
    }

    brand = await BrandProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand profile
// @route   DELETE /api/brands/:id
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await BrandProfile.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand profile not found' });
    }

    await BrandProfile.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Brand profile removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload brand guideline file and extract text
// @route   POST /api/brands/:id/guidelines
exports.uploadGuideline = async (req, res, next) => {
  try {
    const brand = await BrandProfile.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a guideline document' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    let extractedText = '';

    // Attempt text extraction via Python AI service
    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/extract-text`, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 10000,
      });

      if (aiResponse.data && aiResponse.data.text) {
        extractedText = aiResponse.data.text;
      }
    } catch (aiErr) {
      console.warn('AI document extractor not reachable or failed, falling back to local text reading:', aiErr.message);
      if (ext === 'txt') {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } else {
        extractedText = `Uploaded document: ${req.file.originalname} (${req.file.size} bytes). Guideline registered.`;
      }
    }

    const newGuideline = {
      title: req.body.title || req.file.originalname,
      fileUrl: `/uploads/${path.basename(filePath)}`,
      fileType: ext,
      extractedText,
      uploadedAt: new Date(),
    };

    brand.guidelines.push(newGuideline);
    await brand.save();

    res.status(201).json({
      success: true,
      data: newGuideline,
      brand,
    });
  } catch (error) {
    next(error);
  }
};
