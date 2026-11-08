const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);

router.route('/')
  .get(brandController.getBrands)
  .post(brandController.createBrand);

router.route('/:id')
  .get(brandController.getBrandById)
  .put(brandController.updateBrand)
  .delete(brandController.deleteBrand);

router.post('/:id/guidelines', upload.single('file'), brandController.uploadGuideline);

module.exports = router;
