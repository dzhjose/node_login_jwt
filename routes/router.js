const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;