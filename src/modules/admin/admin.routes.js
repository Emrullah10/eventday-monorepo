const express = require('express');
const router = express.Router();
const AdminController = require('./admin.controller');
const authMiddleware = require('../../common/middlewares/auth');

// All admin routes should be protected
router.get('/pending', authMiddleware, AdminController.getPending);
router.post('/approve/:id', authMiddleware, AdminController.approve);
router.post('/reject/:id', authMiddleware, AdminController.reject);
router.put('/update/:id', authMiddleware, AdminController.updateAndPublish);

module.exports = router;
