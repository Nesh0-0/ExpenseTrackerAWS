const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const user = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    totalExpense: {
        type: DataTypes.INTEGER
    }
},
    { timestamps: false });


module.exports = user;