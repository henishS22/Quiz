const mongoose = require('mongoose');
const db = require('../connection/dbMaster');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain "Password"');
            }
        }
    },
    userToken: {
        type: String,
    },
    tokenExpiresIn: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (password, encryptedPass) {
    return await bcrypt.compare(password, encryptedPass);
}

const Users = db.model('Users', userSchema);
module.exports = Users;