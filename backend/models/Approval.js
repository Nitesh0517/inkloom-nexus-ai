const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentReview',
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reviewerName: {
      type: String,
      default: 'Human Compliance Officer',
    },
    decision: {
      type: String,
      enum: ['Approved', 'Rejected', 'Changes Requested'],
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
    versionReviewed: {
      type: String,
      enum: ['Original', 'AI-Improved', 'Custom'],
      default: 'AI-Improved',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Approval', approvalSchema);
