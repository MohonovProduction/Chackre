const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: '',
    database: 'testdb'
})

const DBConnect = {}

DBConnect.test = function() {
    con.connect(function (err) {
        if (err) console.log(err)
        console.log('Connected!')
    })
}

DBConnect.createDB = function(name) {
    con.connect((err) => {
        if (err) console.log(err)
        con.query(`CREATE DATABASE ${name}`, (err,res) => {
            if (err) console.log(err)
            console.log(res)
        })
    })
}

DBConnect.createTables = function() {
    con.connect((err) => {
        if (err) console.log(err)
        const req = `CREATE TABLE jokes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(1000)
        );
        CREATE TABLE gachies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            link VARCHAR(1000)
        );
        CREATE TABLE fuck (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(1000)
        );`
        con.query(req, (err, res) => {
            if (err) console.log(err)
            console.log(res)
        })
    })
}

DBConnect.getJoke = function () {
    con.connect((err) => {
        if (err) console.log(err)
        const req = `SELECT * FROM jokes`
        con.query(req, (err, res) => {
            if (err) console.log(err)
            console.log(res)
        })
    })
}

module.exports = { DBConnect }
