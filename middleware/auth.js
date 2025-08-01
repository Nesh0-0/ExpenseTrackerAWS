const jwt = require('jsonwebtoken');
// const {users} = require('../models/associations');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(req.header());
        // console.log(token);
        const userId = jwt.verify(token, 'secretkey');
        console.log("userId ----> ", userId);
        req.userId = userId;
        console.log('Exiting middleware');
        next();
    }
    catch (err) {
        res.status(500).json({message: `${err}`});
    }
}

module.exports = authenticate;