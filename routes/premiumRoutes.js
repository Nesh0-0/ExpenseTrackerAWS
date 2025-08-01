const express = require('express');
const router = express.Router();
const path = require('path');
const premiumController = require('../controllers/premiumController');
const auth = require('../middleware/auth');


router.get('/leaderboard', auth, premiumController.getLeaderboard);
router.get('/download', auth, premiumController.downloadExpenses);


module.exports = router;