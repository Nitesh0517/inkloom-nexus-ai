const mongoose = require('mongoose');

const brandProfileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
      default: 'Technology',
    },
    mission: {
      type: String,
      default: '',
    },
    brandVoice: {
      tone: {
        type: [String],
        default: ['Professional', 'Authoritative', 'Trustworthy', 'Empathetic'],
      },
      formality: {
        type: String,
        enum: ['Casual', 'Semi-Formal', 'Formal', 'Technical'],
        default: 'Semi-Formal',
      },
      dos: {
        type: [String],
        default: [],
      },
      donts: {
        type: [String],
        default: [],
      },
      readingLevel: {
        type: String,
        default: 'General Public (Grade 9-12)',
      },
    },
    targetAudience: {
      type: String,
      default: 'Business decision makers, enterprise IT leaders, and professionals.',
    },
    preferredTerms: [
      {
        term: { type: String, required: true },
        replacementFor: { type: String, default: '' },
        context: { type: String, default: '' },
      },
    ],
    restrictedTerms: [
      {
        term: { type: String, required: true },
        reason: { type: String, default: 'Violates brand messaging policy' },
        severity: { type: String, enum: ['Critical', 'Warning'], default: 'Critical' },
      },
    ],
    approvedFacts: [
      {
        fact: { type: String, required: true },
        category: { type: String, default: 'General' },
        source: { type: String, default: 'Official Brand Fact Sheet' },
        verifiedDate: { type: Date, default: Date.now },
      },
    ],
    prohibitedClaims: [
      {
        claim: { type: String, required: true },
        reason: { type: String, default: 'Unsubstantiated or regulatory violation' },
        severity: { type: String, enum: ['Critical', 'Warning'], default: 'Critical' },
      },
    ],
    guidelines: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, default: '' },
        fileType: { type: String, default: 'pdf' },
        extractedText: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    assets: [
      {
        name: { type: String, required: true },
        type: { type: String, default: 'logo' },
        url: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BrandProfile', brandProfileSchema);
