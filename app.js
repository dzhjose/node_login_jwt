const express = require('express');

const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');

const app = express();

//MOTOR DE PLANTILLA
app.set('view engine', 'ejs');

//PUBLIC
app.use(express.static('public'));

//ENCODED DATA FROM FORMS
app.use(express.urlencoded({extended:true}));
app.use(express.json());

dotenv.config({path: './env/.env'});

app.use(cookieParser());

//ROUTER
app.use('/', require("./routes/router"));

app.use( function (req, res, next){
    if(!req.user){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();
});

app.listen(3000 , () => {
    console.log("SERVER ON")
});

