const User = require('../models/user');
const { handleResponse, handleError } = require('../utils/requestHandlers');

exports.loggedIn = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.send('Login First !');
        createError(401, 'Please Login First');
    }
    const user = await User.findOne({ userToken: token });
    if (!user) {
        res.send('No user Found !');
    } else {
        req.user = user;
        next();
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role == 'admin') {
            next()
        } else {
            handleResponse({ res, statusCode: 500, data: 'This route is only for Admin' });
        }
    } catch (e) {
        handleError({ res, data: e });
    }
}