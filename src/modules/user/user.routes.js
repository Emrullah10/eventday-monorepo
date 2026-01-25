const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');

// Register a new user
router.post('/register', UserController.register);

// Login
router.post('/login', UserController.login);

module.exports = router;
