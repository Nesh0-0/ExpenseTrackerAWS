const Sib = require('sib-api-v3-sdk');
require('dotenv').config(); // Load environment variables


const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY; // Replace with your API key

const transactionalEmailApi = new Sib.TransactionalEmailsApi();

const sendEmail = async ( to, subject, htmlContent ) => {
    try {
        const sender = {
            email: 'ganesan.s99@gmail.com',
            name: 'ExpensesApp'
        };

        const receivers = [{ email: to }];

        await transactionalEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject,
            htmlContent,
        });

        console.log(`✅ Email sent to ${to}`);
        return true;
    } catch (err) {
        console.error('❌ Error sending email:', err);
        return false;
    }
};

module.exports = { sendEmail };
