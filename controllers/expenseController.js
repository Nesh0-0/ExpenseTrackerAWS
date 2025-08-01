const { expenses, users } = require('../models/associations');
const sequelize = require('../utils/db');


const addExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const expenseDetails = req.body;
        const { amount } = expenseDetails;
        expenseDetails.userId = req.userId.id;
        const addDetails = await expenses.create(expenseDetails, {transaction: transaction},);
        const updateExpense = await users.increment('totalExpense', {
            by: amount,
            where: { id: req.userId.id },
            transaction: transaction
        });
        // updateTotalExpense.save();
        transaction.commit();                                                      
        res.status(201).json(addDetails);                                                              
    }
    catch (err) {
        console.log(err);
        transaction.rollback();
        res.status(500).json({ err: `${err}` });
    }
};


const getExpenses = async (req, res) => {
    try {
        console.log(req.query);
        let { page, entries } = req.query;
        console.log(`page = ${page}, entries = ${entries}`);
        page = parseInt(page, 10);
        entries = parseInt(entries, 10);
        const userId = req.userId.id;

        // Pagination calculation
        const limit = entries;
        const offset = (page - 1) * entries;

        const details = await expenses.findAll({
            where: { userId },
            limit,
            offset, 
        });

        res.status(200).json(details);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: `${err}` });
    }
};

const getExpensesCount = async (req, res) => {
    try {   
        const userId = req.userId.id;
        const count = await expenses.count({where: { userId }});
        res.status(200).json({ success: true, message: 'success', totalCount: count });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch expenses count'});
    }
};



const deleteExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const expense = await expenses.findOne({
            where: {
                id
            },
            attributes: ['amount']
        });
        console.log('Expenseeeee - ', expense.amount);
        const updateTotalExpense = await users.decrement('totalExpense', {
            by: expense.amount,
            where: { id: req.userId.id },
            transaction: transaction
        });
        const deleteExpense = await expenses.destroy({
            where: {
                id: id
            },
            transaction: transaction
        });
        await transaction.commit();
        console.log('Expense deleted successfully!');
        res.status(200).json(deleteExpense);
    }
    catch (err) {
        console.log(err);
        await transaction.rollback();
        res.status(500).json({ err: `${err}` });
    }
};

module.exports = {
    addExpense,
    deleteExpense,
    getExpenses,
    getExpensesCount
};
