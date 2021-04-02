const mongoose = require('mongoose');
const db = require('../connection/dbMaster');

const quizQuestionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
    },
    category: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        value: {
            type: String,
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],

})

const Questions = db.model('Questions', quizQuestionSchema);
module.exports = Questions;