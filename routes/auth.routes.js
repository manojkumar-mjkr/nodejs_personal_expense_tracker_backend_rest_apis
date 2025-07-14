const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/refreshToken', authController.refreshToken);
// /()=>console.log('login api token Validated')
// ()=>console.log('register api token Validated')

module.exports = router;
