const {users} = require('../models/associations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../utils/db');


const addUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, password } = req.body;
        // console.log({name, email, username})
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

        bcrypt.hash(password, saltRounds, async (err, encrypted) => {
            try {
                const entry = await users.create({ name, email, password: encrypted, totalExpense: 0 }, {transaction});
                console.log(entry);
                transaction.commit();
                res.status(201).json(entry);

            }
            catch (err) {
                console.log(err);
                transaction.rollback();
                res.status(500).json({error: `${err}`});
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: `${err}` });
    }
};


const getUser = async email => {
    try {
        const userDetails = await users.findAll({where: {email: email}});
        console.log(userDetails);

        return userDetails;
    }
    catch (err) {
        console.log(err);
        return err;
    }
};

const generateToken = (id) => {
    return jwt.sign({ id: id }, 'secretkey');
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await getUser(email);

        if (userDetails.length === 0 || userDetails[0].email === undefined) {
            res.status(404).json({message: "Email id not found!"});
        }
        bcrypt.compare(password, userDetails[0].password, (err, result) => {
            if (result === true) {
                res.status(200).json({ success: true, message: "success", result, token: generateToken(userDetails[0].id) });
            }
            else {
                res.status(400).json({ success: false,  message: "incorrect password!", result });
            }
        });


    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: `${err}` });
    }
};



module.exports = {
    addUser,
    login
};