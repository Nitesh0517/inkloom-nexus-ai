const mongoose = require('mongoose');

const findingSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  category: {
    type: String,
    enum: [
      'Tone Consistency',
      'Terminology Compliance',
      'Factual Accuracy',
      'Brand Messaging',
      'Visual Guidance',
      'Regulatory & Compliance',
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Critical', 'Warning', 'Suggestion', 'Passed'],
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  originalText: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    required: true,
  },
  guidelineReference: {
    type: String,
    default: 'Official Brand Governance Policy',
  },
  sourceReference: {
    type: String,
    default: 'Brand Guidelines',
  },
  suggestedCorrection: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['Needs Review', 'Verified Fact', 'Requires Human Verification', 'Resolved', 'Passed'],
    default: 'Needs Review',
  },
  isApplied: {
    type: Boolean,
    default: false,
  },
  isIgnored: {
    type: Boolean,
    default: false,
  },
});

const contentReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrandProfile',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: [
        'Social Media Posts',
        'Marketing Emails',
        'Advertisements',
        'Blog Content',
        'Product Descriptions',
        'Website Content',
        'Press Releases',
      ],
      required: true,
    },
    originalContent: {
      type: String,
      required: true,
    },
    improvedContent: {
      type: String,
      default: '',
    },
    consistencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    findings: [findingSchema],
    passedChecks: [
      {
        rule: String,
        details: String,
      },
    ],
    warnings: [String],
    status: {
      type: String,
      enum: ['Draft', 'Under Review', 'Changes Requested', 'Approved', 'Rejected'],
      default: 'Draft',
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reviewedAt: {
      type: Date,
    },
    isAiGenerated: {
      type: Boolean,
      default: true,
    },
    metadata: {
      wordCount: Number,
      readingTimeMinutes: Number,
      analyzedWithModel: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for issues count
contentReviewSchema.virtual('criticalCount').get(function () {
  return this.findings ? this.findings.filter((f) => f.severity === 'Critical').length : 0;
});

contentReviewSchema.virtual('warningCount').get(function () {
  return this.findings ? this.findings.filter((f) => f.severity === 'Warning').length : 0;
});

contentReviewSchema.virtual('suggestionCount').get(function () {
  return this.findings ? this.findings.filter((f) => f.severity === 'Suggestion').length : 0;
});

module.exports = mongoose.model('ContentReview', contentReviewSchema);
