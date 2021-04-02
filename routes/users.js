const express = require('express');
const router = express.Router();
const { registration, login } = require('../controllers/user');

/* GET users listing. */
router.post('/register', registration);
router.put('/login', login);

module.exports = router;
