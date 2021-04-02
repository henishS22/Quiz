const Questions = require("../models/quizQuestions");
const {
    createQuiz,
    createQuestion,
    allQuizes,
    allQuestions,
    quizPlayed,
    openQuiz,
    storeResult,
    updateQuizPlayedStatus,
    findCategoryWise,
    findTotalMarks,
    updateMarks,
    getQuizResponse
} = require("../services/quiz");

const {
    handleError,
    handleResponse
} = require("../utils/requestHandlers")


exports.addQuiz = async (req, res, next) => {
    try {
        const quiz = await createQuiz(req.body);
        handleResponse({ res, data: quiz });
    } catch (e) {
        handleError({ res, data: e });
    }
}

exports.addQuestion = async (req, res, next) => {
    try {
        const ques = await createQuestion(req.body);
        handleResponse({ res, data: ques });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

exports.getAllQuiz = async (req, res, next) => {
    try {
        const quiz = await allQuizes();
        handleResponse({ res, data: quiz });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

exports.getAllQuestions = async (req, res, next) => {
    try {
        const ques = await allQuestions();
        handleResponse({ res, data: ques });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

exports.enrollInQuiz = async (req, res, next) => {
    try {
        const quizId = req.query.id;
        const playingStatus = await quizPlayed(req.user._id, quizId);
        if (playingStatus) {
            handleResponse({ res, data: 'You have already played this Quiz' });
        }
        const quiz = await openQuiz(quizId);
        handleResponse({ res, data: quiz });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

exports.submitAns = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const result = await storeResult(req.body);
        await updateQuizPlayedStatus(req.user._id, req.body.quizId);
        const totalMarks = await findTotalMarks(req.body.quizId, req.user._id);
        const data = await findCategoryWise(req.body.quizId, req.user._id);
        const Result = [...totalMarks, ...data];
        await updateMarks(result._id,totalMarks[0].totalMarks,totalMarks[0].Percentage,data)
        handleResponse({ res, data: Result });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

exports.quizResponse = async (req, res, next) => {
    try {
        const response = await getQuizResponse(req.query.id);
        handleResponse({ res, data: response });
    } catch (e) {
        handleError({ res, data: e.message });
    }
}

