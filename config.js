const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

module.exports = {
    db: {
        str: process.env.DATABASE.replace(
            '<PASSWORD>',
            process.env.DATABASE_PASSWORD
        ),

        options: {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }

    }
}