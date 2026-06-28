const express = require('express');
const authController = require('./auth.controller');

const Checkauth = require('../middle-ware/Checkauth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/uuidverify', Checkauth, authController.uuidVerify);
router.get('/authtime', Checkauth, authController.authTime);

module.exports = router;
