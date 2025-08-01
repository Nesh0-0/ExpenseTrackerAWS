const { Body } = require('sib-api-v3-sdk');
const { expenses, users } = require('../models/associations');
const AWS = require('aws-sdk');
const { response } = require('express');
require('dotenv').config();
// const Sequelize = require('../utils/db');
// const Sequelize = require('sequelize');


const getLeaderboard = async (req, res) => {
    try {
        const result = await users.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
 
        });

        // console.log(result);
        res.status(200).json({success: true, data: result});
    }
    catch (err) {
        res.status(500).json({success: false, message: `${err.response.data}`});
    }
};


const downloadExpenses = async (req, res) => {
    try {
        console.log('Inside downloadExpenses');
        const userId = req.userId.id;
        const details = await expenses.findAll({
            where: { userId }
        });
        const stringifiedDetails = JSON.stringify(details);
        console.log('details');
        const fileName = 'Expenses.txt';
        console.log('details');
        const fileurl = await uploadToS3(stringifiedDetails, fileName);
        console.log("fileurl = ", fileurl);
       
        res.status(200).json({success: true, message: `Success`, url: fileurl});
          
    }
    catch (err) {
        console.log("Erorrrrrrrrrr! = ", err);
        res.status(500).json({success: false, message: `${err.response.data}`});
    }
};

const uploadToS3 = (data, fileName) => {
    try {
        const s3Bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: 'ap-south-2' 
            });
        const params = {Bucket: "expensetrackerproject99", Key: fileName, Body: data, ACL: 'public-read'};
        return new Promise((resolve, reject) => {
            
            s3Bucket.upload(params, (err, s3response) => {
                if (err) {
                    console.log('Something went wrong', err);
                    reject(err);
                }
                else {
                    console.log(s3response.Location);
                    resolve(s3response.Location);
                }
            });

        });
    }
    catch (err) {
        return err;
    }

};


module.exports = {
    getLeaderboard,
    downloadExpenses
};