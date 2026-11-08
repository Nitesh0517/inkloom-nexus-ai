const express = require('express');
const router = express.Router();
const aiProxyController = require('../controllers/aiProxyController');
const { authenticate } = require('../middleware/auth');

router.get('/status', aiProxyController.getAiStatus);

router.use(authenticate);
router.post('/analyze', aiProxyController.analyzeContent);
router.post('/suggest', aiProxyController.suggestContent);

module.exports = router;
