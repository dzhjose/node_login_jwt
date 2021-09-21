const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
const db = require('../database/db');
const {promisify} = require('util');
const Swal = require('sweetalert2')

//REGISTER

exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let hash = await bycript.hash(password, 8);
        db.query('INSERT INTO users SET ?', {name:name, email:email, password:hash}, (error, results) => {
            if(error){
                console.log('ERROR IN INSERT USER', error);
            }

            res.redirect('/login');
        });
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Email and password needed',
                alertIcon: 'info',
                showConfirmButton: true,
                timer:false,
                route: 'login'
            });
        }

        console.log(email, password);

    } catch (error) {
        console.log(error);
    }
}
