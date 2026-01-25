const express = require('express');
const router = express.Router();
const AggregatorController = require('./aggregator.controller');
const authMiddleware = require('../../common/middlewares/auth');

// Trigger sync - Normally this would be a CRON job, but we expose it for testing/manual sync
// Admin only check should be here
router.post('/sync', authMiddleware, AggregatorController.triggerSync);

module.exports = router;
