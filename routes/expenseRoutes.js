const express = require('express');
const router = express.Router();
const path = require('path');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.post('/addExpense', auth, expenseController.addExpense);
router.get('/getExpenses', auth, expenseController.getExpenses);
router.delete('/deleteExpense/:id', auth, expenseController.deleteExpense);
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/views/expenses.html'));
});
router.get('/count', auth, expenseController.getExpensesCount);

module.exports = router;