const { createUser, findUserByEmail, updateUserByEmail } = require('../services/user');
const { handleResponse, handleError } = require('../utils/requestHandlers');
const jwt = require('jsonwebtoken');

exports.registration = async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        handleResponse({ res, data: user });
    } catch (e) {
        handleError({ res, data: e });
    }
}

exports.login = async (req, res, next) => {
    try {
        const findUser = await findUserByEmail(req.body.email);
        if (!findUser) {
            handleResponse({ res, data: 'This email is not registered, please register First' });
        } else {
            const match = await findUser.correctPassword(req.body.password, findUser.password);
            if (match == false) {
                handleResponse({ res, data: 'Incorrect Password, Try Again !' });
            } else {
                const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);
                const user = await updateUserByEmail(req.body.email, { userToken: token, tokenExpiresIn: Date.now() });
                handleResponse({ res, statusCode: 201, msg: 'Logged In', data: user });
            }
        }
    } catch (e) {
        handleError({ res, data: e });
    }
}