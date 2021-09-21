const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect( error => {
    if(error){
        console.log("ERROR IN CONECTION DB", error);
        return;
    }

    console.log('DATABASE CONNECTED');
});

module.exports = connection;