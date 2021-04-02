const mongoose = require('mongoose');
const config = require('../config');
const db = mongoose.createConnection(config.db.str, config.db.options);

db.on('connected', () => {
    console.log("connected")
})

db.on('disconnected', () => {
})

db.on('error', () => {
})

db.on('reconnected', () => {
})

module.exports = db;