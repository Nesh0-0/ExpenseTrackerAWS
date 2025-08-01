const express = require('express');
const router = express.Router();
const path = require('path');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const auth = require('../middleware/auth');


router.get('/forgotPassword', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/forgotPassword.html'));
});

router.post('/sendEmail', forgotPasswordController.sendResetLink);

router.get('/resetPassword/:uuid', forgotPasswordController.resetPassWord);

router.post('/updatePassword', forgotPasswordController.updatePassword);

module.exports = router;