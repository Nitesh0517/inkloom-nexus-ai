const Approval = require('../models/Approval');
const ContentReview = require('../models/ContentReview');

// @desc    Submit human review decision (Approve, Reject, Request Changes)
// @route   POST /api/approvals
exports.createApproval = async (req, res, next) => {
  try {
    const { reviewId, decision, comments, versionReviewed } = req.body;

    if (!reviewId || !decision) {
      return res.status(400).json({
        success: false,
        message: 'reviewId and decision are required',
      });
    }

    if (!['Approved', 'Rejected', 'Changes Requested'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Decision must be Approved, Rejected, or Changes Requested',
      });
    }

    const review = await ContentReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Create approval record
    const approval = await Approval.create({
      reviewId,
      reviewerId: req.user?._id,
      reviewerName: req.user?.name || 'Authorized Compliance Officer',
      decision,
      comments: comments || `Status updated to ${decision} by reviewer.`,
      versionReviewed: versionReviewed || 'AI-Improved',
    });

    // Update review status
    review.status = decision;
    review.reviewerNotes = comments || review.reviewerNotes;
    review.reviewedBy = req.user?._id;
    review.reviewedAt = new Date();
    await review.save();

    res.status(201).json({
      success: true,
      data: approval,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approvals for a specific review or all approvals
// @route   GET /api/approvals
exports.getApprovals = async (req, res, next) => {
  try {
    const { reviewId } = req.query;
    const filter = reviewId ? { reviewId } : {};

    const approvals = await Approval.find(filter)
      .populate('reviewerId', 'name email role')
      .populate('reviewId', 'title contentType consistencyScore')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: approvals.length,
      data: approvals,
    });
  } catch (error) {
    next(error);
  }
};
