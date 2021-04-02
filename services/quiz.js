const { Mongoose } = require('mongoose');
const Quiz = require('../models/quiz');
const Questions = require('../models/quizQuestions');
const Results = require('../models/quizResult');
const Users = require('../models/user');
const mongoose = require('mongoose');

exports.createQuiz = (data) => {
    return Quiz.create(data);
}

exports.createQuestion = (data) => {
    return Questions.create(data);
}

exports.allQuizes = () => {
    return Quiz.find({}).select('name');
}

exports.allQuestions = () => {
    return Questions.find({});
}

exports.quizPlayed = (id, quizId) => {
    return Users.findOne({ _id: id, quizPlayed: quizId });
}

exports.openQuiz = (quizId) => {
    return Questions.find({ quiz: quizId }, { 'options.isCorrect': 0, 'quiz': 0 });
}

exports.storeResult = (data) => {
    console.log("stored");
    return Results.create(data);
}

exports.updateQuizPlayedStatus = (id, quizId) => {
    return Quiz.findOneAndUpdate({ _id: quizId }, { $push: { playedBy: id } });
}

exports.getQuizResponse = (id) => {
    return Quiz.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $project: {
                    _id:0,
                    quiz: "$_id",
                    playedBy:1
                }
        }
    ])
}

exports.findCategoryWise = (qId, uId) => {
    // return Questions.findOne({ _id: id }).select('options');
    return Results.aggregate([
        {
            $match: {
                $and: [
                    { user: mongoose.Types.ObjectId(uId) },
                    { quizId: mongoose.Types.ObjectId(qId) }
                ]
            }
        },
        {
            "$project": {
                "quizId": 1,
                "options": {
                    "questionId": 1,
                    "selectedOption": 1,
                }
            }
        },
        {
            $unwind: "$options"
        },
        {

            $lookup: {
                from: 'questions', as: 'Question',
                let: { que: '$options' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { quiz: mongoose.Types.ObjectId(qId) },
                                    { $eq: ["$_id", "$$que.questionId"] }
                                ]
                            }
                        }
                    },
                    {
                        $unwind: "$options"
                    },
                    {
                        $match: {
                            "options.isCorrect": true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            question: 1,
                            category: 1,
                            options: {
                                _id: 1,
                                isCorrect: 1,
                                value: 1
                            },
                            mark: {
                                $cond: { if: { $eq: ["$options._id", "$$que.selectedOption"] }, then: 1, else: 0 }
                            },
                            categoryN: {
                                $cond: { if: { $eq: ["$options._id", "$$que.selectedOption"] }, then: "$category", else: null }
                            }
                        }
                    }

                ]
            }

        },
        /* Category Count */
        {
            $group: {
                _id: {
                    "catTotal": "$Question.category",
                    "correctCat":
                    {
                        $arrayElemAt: [
                            '$Question.categoryN', 0
                        ]
                    },
                },
                "Firstcount": { $sum: 1 },
            }
        },
        {
            $group: {
                _id: "$_id.catTotal",
                cats: {
                    $push: {
                        $cond: [
                            {
                                $ne: ["$_id.correctCat", null]
                            },
                            {
                                "cat": "$_id.correctCat",
                            }, "$$REMOVE"
                        ],
                    },
                },
                count: { "$sum": "$Firstcount" }
            }
        },
        {
            $project: {
                _id: 0,
                categoryName: {
                    $arrayElemAt: [
                        '$_id', 0
                    ]
                },
                totalCount: "$count",
                categoryWiseCorrect: {
                    $size: "$cats"
                }
            }
        },
        {
            $project: {
                _id: 0,
                categoryName: "$categoryName",
                totalCount: "$totalCount",
                categoryWiseCorrect: "$categoryWiseCorrect",
                categoryWisePercentage: {
                    "$multiply": [
                        { "$divide": ["$categoryWiseCorrect", "$totalCount"] },
                        100
                    ]
                }
            }
        },
        {
            $project: {
                category: "$categoryName",
                categoryWisePercentage: "$categoryWisePercentage"
            }
        }
    ])
}


exports.findTotalMarks = (qId, uId) => {
    // return Questions.findOne({ _id: id }).select('options');
    return Results.aggregate([
        {
            $match: {
                $and: [
                    { user: mongoose.Types.ObjectId(uId) },
                    { quizId: mongoose.Types.ObjectId(qId) }
                ]
            }
        },
        {
            "$project": {
                "quizId": 1,
                "options": {
                    "questionId": 1,
                    "selectedOption": 1,
                }
            }
        },
        {
            $unwind: "$options"
        },
        {

            $lookup: {
                from: 'questions', as: 'Question',
                let: { que: '$options' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { quiz: mongoose.Types.ObjectId(qId) },
                                    { $eq: ["$_id", "$$que.questionId"] }
                                ]
                            }
                        }
                    },
                    {
                        $unwind: "$options"
                    },
                    {
                        $match: {
                            "options.isCorrect": true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            question: 1,
                            category: 1,
                            options: {
                                _id: 1,
                                isCorrect: 1,
                                value: 1
                            },
                            mark: {
                                $cond: { if: { $eq: ["$options._id", "$$que.selectedOption"] }, then: 1, else: 0 }
                            },
                            categoryN: {
                                $cond: { if: { $eq: ["$options._id", "$$que.selectedOption"] }, then: "$category", else: null }
                            }
                        }
                    }

                ]
            }

        },
        /* Total Marks */
        {
            $project: {
                _id: 0,
                quiz: '$quizId',
                question: '$options.questionId',
                selected: '$options.selectedOption',
                correct: {
                    $arrayElemAt: [
                        '$Question.options._id', 0
                    ]
                },
                mark: {
                    $sum: "$Question.mark"
                }
            }
        },
        {
            $group: {
                _id: '$quiz',
                marksObtained: {
                    $sum: '$mark'
                },
                totalMarks: {
                    $sum: 1
                },
            }
        },
        {
            $project: {
                _id: 0,
                quiz: "$_id",
                totalMarks: "$marksObtained",
                outOf: "$totalMarks",
                Percentage: {
                    "$multiply": [
                        { "$divide": ["$marksObtained", "$totalMarks"] },
                        100
                    ]
                }
            }
        }
    ])
}

exports.updateMarks = (id, marks, percnt, data) => {
    return Results.findOneAndUpdate({ _id: id }, { marksObtained: marks, percentage: percnt, categoryWise: data }, {
        new: true
    });
}