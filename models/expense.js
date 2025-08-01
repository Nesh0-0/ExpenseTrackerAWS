const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db');

const expenses = sequelize.define('expenses', {
   id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
   },
   amount: {
    type: DataTypes.FLOAT
   },
   description: {
    type: DataTypes.TEXT
   },
   category: {
    type: DataTypes.STRING
   }
},
{timestamps: false});


module.exports = expenses;