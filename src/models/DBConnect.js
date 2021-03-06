const { Pool, Client } = require('pg');
require('dotenv').config()

// Data Base schema https://www.figma.com/file/JjIqqR2swyjDPytHCtbARE/Schema?node-id=0%3A1

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
                .query('CREATE TABLE jokes (id serial, text varchar, UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE gachies (id serial, text varchar, UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE fucks (id serial, text varchar, UNIQUE(text))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE users (id SERIAL, user_id bigint, username varchar, first_name varchar, UNIQUE(user_id))')
                .then( res => console.log(res) )
                .catch( err => console.log(err) )
        })
        .then( () => {
            client
                .query('CREATE TABLE chats (id SERIAL, chat_id bigint, title varchar, UNIQUE(chat_id))')
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
                }
                reject(false)
                console.log(err)
            })
    } )
}

DBConnect.addUser = function (user_id, username, first_name) {
    return new Promise( (resolve, reject) => {
        client
            .query(`INSERT INTO users (user_id, username, first_name) VALUES ('${user_id}', '${username}', '${first_name}')`)
            .then( res => reject(res))
            .catch( err => reject(err) )
    })
}

DBConnect.addChat = function (chat_id, title) {
    return new Promise((resolve, reject) => {
        client
            .query(`INSERT INTO chats (chat_id, title) VALUES ('${chat_id}', '${title}')`)
            .then( res => resolve(true) )
            .catch( err => reject(err) )
    })
}

DBConnect.select = function(table) {
    return new Promise( (resolve, reject) => {
        client
            .query(`SELECT * FROM ${table}`)
            .then( res => resolve(res) )
            .catch( err => reject(err) )
    })
}

module.exports = { DBConnect }
