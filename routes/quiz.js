const express = require('express');
const router = express.Router();
const { addQuestion, addQuiz, getAllQuiz, getAllQuestions, enrollInQuiz, submitAns, quizResponse } = require('../controllers/quiz');
const { loggedIn, isAdmin } = require('../middlewares/auth');

/* users listing. */
router.use(loggedIn);
router.get('/all-quiz', getAllQuiz);
router.put('/enroll', enrollInQuiz);
router.put('/submit', submitAns);

/* Admin Listing */
router.use(isAdmin);
router.post('/add-quiz', addQuiz);
router.post('/add-question', addQuestion);
router.get('/all-questions', getAllQuestions);
router.get('/quiz-response', quizResponse)

module.exports = router;