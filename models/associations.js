const users = require('./user');
const expenses = require('./expense');
const payments = require('./payments');
const forgotPasswordRequests = require('./forgotPasswordRequests');

// One-to-Many
users.hasMany(expenses, { foreignKey: 'userId', onDelete: 'CASCADE' });
expenses.belongsTo(users, { foreignKey: 'userId' });

//One-to-One
users.hasOne(payments);
payments.belongsTo(users);

//One-to-Mant
users.hasMany(forgotPasswordRequests);
forgotPasswordRequests.belongsTo(users);



module.exports = { users, expenses, payments, forgotPasswordRequests };