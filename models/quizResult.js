const mongoose = require('mongoose');
const db = require('../connection/dbMaster');

const quizResultSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    options: [{
        questionId: {
            type: mongoose.Schema.ObjectId,
            required:true
        },
        selectedOption: {
            type: mongoose.Schema.ObjectId,
            required: true
        }
    }],
    marksObtained: {
        marks: Number,
    },
    percentage: Number,
    categoryWise: [{
        category: String,
        categoryWisePercentage:Number
    }]
})

const Results = db.model('Results', quizResultSchema);
module.exports = Results;