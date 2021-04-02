const mongoose = require('mongoose');
const db = require('../connection/dbMaster');

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    playedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }]
})

const Quizes = db.model('Quizes', quizSchema);
module.exports = Quizes;