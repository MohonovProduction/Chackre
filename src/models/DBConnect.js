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

//Create DATABASE (for new servers)
DBConnect.createNewDB = function () {
    client.query('CREATE DATABASE chackre')
        .then( () => {
            client
                .query('CREATE TABLE jokes (id serial, text varchar(10000), UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE gachies (id serial, text varchar(10000), UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE fucks (id serial, text varchar(10000), UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => console.log('DB has been created') )
}

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
            .then( res => {
                resolve(true)
                console.log(res)
            } )
            .catch( err => {
                if (err.detail.indexOf('already exists') > -1) {
                    reject('not unique')
                } else {
                    reject(false)
                }
                console.log(err)
            } )
    } )
}

module.exports = { DBConnect }
