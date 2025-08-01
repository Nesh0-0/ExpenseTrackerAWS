const express = require('express');
const router = express.Router();
const path = require('path');
const paymentController = require('../controllers/paymentsController');
const auth = require('../middleware/auth');

router.get('/pay', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/cashfree.html'));
});

router.post('/processPayment', auth, paymentController.processPayment);

router.get('/paymentStatus/:orderId', paymentController.paymentStatus);

router.get('/result/:status', (req, res) => {
    const {status} = req.params;
    res.send(`<h1>${status}!</h1>`)
});

router.post('/updateStatus', auth, paymentController.updateStatus);

router.get('/isPremium', auth, paymentController.isPremium);


module.exports = router;