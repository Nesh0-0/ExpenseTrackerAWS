const { Cashfree, CFEnvironment } = require("cashfree-pg");
require('dotenv').config();

const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_CLIENT_ID, process.env.CASHFREE_CLIENT_SECRET);


const createOrder = async (orderId, orderAmount, orderCurrency, userId) => {
    try {
        var request = {
            "order_amount": orderAmount,
            "order_currency": orderCurrency,
            "order_id": orderId,
            "customer_details": {
                "customer_id": `${userId}`,
                "customer_phone": "8474090589"
            },
            "order_meta": {
                "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}",
                "payment_methods": "cc,dc,upi"
            }
        };
        console.log("inside createOrder");
        const session_id = await cashfree.PGCreateOrder(request);
        console.log("sessionId = ", session_id);
        return session_id;
    }
    catch (err) {
        console.log(err);
    }

};

const getPaymentStatus = async (orderId) => {
    try {
        const status = await cashfree.PGOrderFetchPayments(orderId);
        console.log(status);
        // return status;
        const getOrderResponse = status.data;

        if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
            orderStatus = "Success"
        } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
            orderStatus = "Pending"
        } else {
            orderStatus = "Failure"

        }
        console.log(orderStatus);
        return orderStatus;
    }
    catch (err) {
        throw new Error(err.response.data);
    }
}

module.exports = { createOrder, getPaymentStatus };