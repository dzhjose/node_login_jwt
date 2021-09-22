const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

router.get('/', authController.isAuthenticated, (req, res) => {
    res.render('index', {user:req.user});
});

router.get('/login', (req, res) => {
    res.render('login', {alert:false});
});

router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;