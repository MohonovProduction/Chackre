const mysql = require('mysql');
require('dotenv').config()

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

const DBConnect = {}

DBConnect.test = function() {
    con.connect((err) => {
        if (err) console.log(err)
        console.log('Connected!')
    })
}

DBConnect.getJoke = function () {
    con.connect((err) => {
        if (err) console.log(err)
        const req = `
            SELECT text FROM jokes ORDER BY RAND() LIMIT 1;
        `
        con.query(req, (err, res) => {
            if (err) console.log(err)
            if (res) {
                console.log(res[0].text)
                return res[0].text
            }
        })
    })
}

DBConnect.getGachi = function () {
    con.connect((err) => {
        if (err) console.log(err)
        const req = `
            SELECT link FROM gachi ORDER BY RAND() LIMIT 1
        `
        con.query(req, (err, res) => {
            if (err) console.log(err)
            if (res) {
                console.log(res[0].link)
                return res[0].link
            }
        })
    })
}

DBConnect.getFuck = function () {
    con.connect((err) => {
        if (err) console.log(err)
        const req = `
            SELECT text FROM fucks ORDER BY RAND() LIMIT 1
        `
        con.query(req, (err,res) => {
            if (err) console.log(err)
            if (res) {
                console.log(res[0].text)
                return res[0].text

            }
        })
    })
}

module.exports = { DBConnect }
