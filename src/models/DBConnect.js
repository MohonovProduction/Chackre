const { Pool, Client } = require('pg');
require('dotenv').config()

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
})

client
    .connect()
    .then( () => console.log('database has been connected') )
    .catch( err => console.error(err.stack) )

const DBConnect = {}

DBConnect.get = function (tableName) {
    return new Promise( (resolve, reject) => {
        client
            .query(`SELECT text FROM ${tableName} ORDER BY RANDOM() LIMIT 1`)
            .then( res => resolve(res.rows[0].text) )
            .catch( err => reject(err) )
    })
}

DBConnect.add = function (tableName, text) {
    return new Promise( (resolve, reject) => {
        client
            .query(`INSERT INTO ${tableName} (text) VALUES ('${text}')`)
            .then( () => resolve(true) )
            .catch( () => reject(false) )
    } )
}

module.exports = { DBConnect }
