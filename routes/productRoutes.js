const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/products', productController.getAllProducts);

// Get product by month
router.get('/products/:month', productController.getProductByMonth);


module.exports = router;
