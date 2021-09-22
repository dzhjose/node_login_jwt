const jwt = require('jsonwebtoken');
const bycriptjs = require('bcryptjs');
const db = require('../database/db');
const {promisify} = require('util');

//REGISTER
exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let hash = await bycriptjs.hash(password, 8);
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
            const swalOptions = {
                alert: true,
                title: 'Error',
                text: 'Email and password needed',
                icon: 'info',
                position: 'center',
                showConfirmButton: true,
                timer: false,
                route: 'login'
            };

            res.render('login', swalOptions);
        }else{
            db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

                if(results.length == 0 || !(await bycriptjs.compare(password, results[0].password))){
                    const swalOptions = {
                        alert: true,
                        title: 'Error',
                        text: 'Email or password incorrect',
                        icon: 'info',
                        position: 'center',
                        showConfirmButton: true,
                        timer:false,
                        route: 'login'
                    };
        
                    res.render('login', swalOptions);
                }else{
                    const id = results[0].id;
                    const token = jwt.sign({id:id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES
                    });

                    const cookieOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                        httpOnly: true
                    };

                    const swalOptions = {
                        alert: true,
                        title: 'Success',
                        text: 'Sign In successfully',
                        icon: 'info',
                        position: 'center',
                        showConfirmButton: false,
                        timer: 800,
                        route: ''
                    };

                    res.cookie('jwt', token, cookieOptions);
                    res.render('login', swalOptions);
                }
            });
        }

    } catch (error) {
        console.log(error);
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if(req.cookies.jwt){
        try {
            const decrypt = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            db.query('SELECT * FROM users WHERE id = ?', [decrypt.id], (error, results) => {
                if(!results) return next();
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        res.redirect('/login');
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/login');
}
