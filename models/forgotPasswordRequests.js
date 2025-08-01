const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db');

const forgotPasswordRequests = sequelize.define('forgotPasswordRequests', {
    id: {
        type: DataTypes.UUID
        ,
        primaryKey: true
    },
    isActive: {
        type: DataTypes.BOOLEAN
    }
}, {timestamps: false});


module.exports = forgotPasswordRequests;