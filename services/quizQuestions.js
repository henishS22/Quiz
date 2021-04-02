const Questions = require('../models/quizQuestions');

exports.createQuestion = (data) => {
    return Questions.create(data);
}