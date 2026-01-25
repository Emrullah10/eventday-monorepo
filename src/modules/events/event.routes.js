const express = require('express');
const router = express.Router();
const EventController = require('./event.controller');
const authMiddleware = require('../../common/middlewares/auth');

router.get('/', EventController.list);
router.get('/:id', EventController.getDetail);
router.post('/', authMiddleware, EventController.create);

module.exports = router;
