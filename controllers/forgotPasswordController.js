const emailServices = require('../services/emailService');
const uuid = require('uuid');
const {forgotPasswordRequests, users} = require('../models/associations');
const bcrypt = require('bcrypt');
const path = require('path');
const sequelize = require('../utils/db');

const sendResetLink = async (req, res) => {
    try {
        //check if the email id exists in the users table
        const {email} = req.body;
        const details = await users.findOne({where: {email}});
        console.log('Details = ', details);
        if (!details) {
            throw new Error('Email id not found!');
            return;
        }
        const id = uuid.v4();
        const subject = "Test Email";
        const htmlContent = `<h1>Click the link to reset your password.<a href='http://localhost:3000/password/resetPassword/${id}'>Reset Password</a></h1>`;
        const status = await emailServices.sendEmail(email, subject, htmlContent);
        if (status) {
            const userId = details.id;
            const entry = await forgotPasswordRequests.create({
                id: id,
                isActive: true,
                userId: userId
            });
            if (entry) {
                res.status(200).json({success: true, message: 'email sent successfully!'});
            }
            else {
                res.status(500).json({success: false, message: 'could not send email!'});
            }
        }
        else {
            res.status(500).json({success: false, message: 'could not send email!'});
        
        }
    }
    catch (err) {
        res.status(500).json({success: false, message: `${err}`});
    }
};


const resetPassWord = async (req, res) => {
    try {
        const {uuid} = req.params;
        const entry = await forgotPasswordRequests.findByPk(uuid);
        if (!entry.isActive) {
            res.status(400).json({success: false, message: 'The request is no longer active. Try again!'});
        }
        else {
            entry.isActive = false;
            await entry.save();
            res.sendFile(path.join(__dirname, '../views/enterNewPassword.html'));

        }
    }
    catch (err) {
        res.status(500).json({success: false, message: `${err}`});
    }
};

// const bcrypt = require('bcrypt');

const updatePassword = async (req, res) => {
    // const t = await sequelize.transaction();
    try {
        // const userId = req.userId.id;
        const { password, email } = req.body;
        const encrypted = await bcrypt.hash(password, 10);
        console.log("encrypted------------->",encrypted);
        const entry = await users.findOne({where: {email}});
        console.log('entry ---------------> ', entry);
        if (!entry) {
            // await t.rollback();
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        entry.password = encrypted;
        await entry.save();

        // await t.commit();
        res.status(200).json({ success: true, message: 'Password updated successfully!' });
    } catch (err) {
        // if (t) await t.rollback();
        res.status(500).json({ success: false, message: `${err}` });
    }
};

module.exports = {sendResetLink, resetPassWord, updatePassword
    
};