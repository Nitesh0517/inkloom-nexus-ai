const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/trends', analyticsController.getTrends);

module.exports = router;
