const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



router.get('/dashboard', auth.verifyToken, async (req, res) => {
});



module.exports = router;