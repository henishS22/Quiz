const Users = require('../models/user');

exports.createUser = (data) => {
    return Users.create(data);
}

exports.findUserByEmail = (data) => {
    return Users.findOne({ email: data });
}

exports.updateUserByEmail = async (email, data) => {
    return Users.findOneAndUpdate({ email:email }, data, {
        new: true
    });
}