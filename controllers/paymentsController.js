const cashfreeService = require('../services/cashfreeService');
const {payments} = require('../models/associations');

const processPayment = async (req, res) => {
    try {
        console.log('Inside processPayment');
        const orderId = 'ORDER-' + Date.now();
        const orderAmount = 2000;
        const orderCurrency = 'INR';
        const userId = req.userId.id;

        console.log(req.userId);

        const payment = await cashfreeService.createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            userId
        );
        console.log('Created order Id!');
        const entry = await payments.create({userId: userId, status: "PENDING"});
        
        
        console.log("PaymentSessionId = ", payment.data.payment_session_id);
        // console.log(payment.data);
        res.status(200).json({success: true, message: 'Successful', paymentDetails: payment.data});
    }

    catch (err) {
        // console.log(err);
        res.status(500).json({success: false, message: `${err}`});
    }

    
};


const paymentStatus = async (req, res) => {
    try {
        const {orderId} = req.params;
        const status = await cashfreeService.getPaymentStatus(orderId);
        res.status(200).json({success: true, message: 'Successful', status});
    }
    catch (err) {
        res.status(500).json({success: false, error: `${err}`});
    }
};


const updateStatus = async(req, res) => {
    try {
        const id = req.userId.id;
        const paymentDetails = await payments.findOne({
            where: {userId: id}
        });
        console.log(paymentDetails);
        paymentDetails.status = "SUCCESS";
        await paymentDetails.save();
        res.json({success: true, message: 'Updated', paymentDetails});
    }
    catch (err) {
        res.status(400).json({success: false, message: `${err}`});
    }
};

const isPremium = async (req, res) => {
    try {
        const userId = req.userId.id;
        const details = await payments.findOne({where: {userId}});
        console.log('details - ', details);
        //if details is not empty and deatils.status == "SUCCESS"
        if (details && details.status == "SUCCESS") {
            res.status(200).json({success: true, message: 'User is a premium user'});
            return;

        }

        res.status(200).json({success: false, message: 'User is not a premium user'},);
    }
    catch (err) {
        res.status(400).json({error: `${err}`});
    }
};

module.exports = {processPayment, paymentStatus, updateStatus, isPremium};