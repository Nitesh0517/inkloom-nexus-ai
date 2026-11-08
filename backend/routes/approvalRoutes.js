const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(approvalController.getApprovals)
  .post(authorize('compliance_officer', 'admin', 'reviewer'), approvalController.createApproval);

module.exports = router;
