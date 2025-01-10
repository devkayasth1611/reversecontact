// routes/bulkUploadRoutes.js
const express = require('express');
const router = express.Router();
const { addBulkUploadEntry, getBulkUploadStatistics } = require('../controller/bulkUploadController');

// Add a bulk upload entry
router.post('/add', addBulkUploadEntry);

// Get bulk upload statistics
router.get('/statistics', getBulkUploadStatistics);

module.exports = router;
