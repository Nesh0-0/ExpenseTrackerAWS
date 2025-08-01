const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db');

const payments = sequelize.define('payments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING
    },
},
{timestamps: false});

module.exports = payments;