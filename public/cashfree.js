const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async () => {
    try {

        const token = JSON.parse(localStorage.getItem('token'));
    
        const createOrder = await axios.post('/payments/processPayment', {}, { headers: { 'Authorization': token } });
        console.log(createOrder.data);
        const { order_id, payment_session_id } = createOrder.data.paymentDetails;
        let checkoutOptions = {
            paymentSessionId: payment_session_id,
            redirectTarget: "_modal",
        };
        console.log(order_id, payment_session_id);
        const result = await cashfree.checkout(checkoutOptions);
        console.log('result');
        if (result.error) {
            // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
            console.log("User has closed the popup or there is some payment error, Check for Payment Status");
            console.log(result.error);
        }
        if (result.redirect) {
            // This will be true when the payment redirection page couldnt be opened in the same window
            // This is an exceptional case only when the page is opened inside an inAppBrowser
            // In this case the customer will be redirected to return url once payment is completed
            console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
            // This will be called whenever the payment is completed irrespective of transaction status
            console.log("Payment has been completed, Check for Payment Status");
            console.log(result.paymentDetails.paymentMessage);
    
            const paymentStatus = await axios.get(`/payments/paymentStatus/${order_id}`);
            console.log(paymentStatus.data);
            const status = paymentStatus.data.status;
            console.log('token ', token);
            await axios.post('/payments/updateStatus', {}, { headers: { 'Authorization': token } });
            window.location.href = `/expenses`;
        }
    }
    catch (err) {
        console.log(err);
    }


    });