const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes.js');
const expenseRoutes = require('./routes/expenseRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const premiumRoutes = require('./routes/premiumRoutes.js');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes.js');
const db = require('./utils/db.js');
const {users, expenses, payments} = require('./models/associations.js');
const { FORCE } = require('sequelize/lib/index-hints');
const compression = require('compression');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'});

app.use(morgan("combined", {stream: accessLogStream}));
app.use(compression());
app.use(express.json());
app.use(express.static('public'));
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/payments', paymentRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', forgotPasswordRoutes);



db.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running  http://localhost:${process.env.PORT}/users/signup`);
    });

}).catch(err => {
    console.log("Could not run server!");
});


