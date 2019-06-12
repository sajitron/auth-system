"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    lastName: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose_1.SchemaTypes.String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    logNumber: { type: mongoose_1.SchemaTypes.Number }
});
// hash password before saving user
UserSchema.pre('save', function (next) {
    const user = this;
    // generate a salt and run the callback
    bcrypt_1.default.genSalt(10, function (err, salt) {
        if (err)
            return next(err);
        // encrypt the password using the salt
        bcrypt_1.default.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (userPassword, callback) {
    bcrypt_1.default.compare(userPassword, this.password, function (err, isMatch) {
        if (err)
            return callback(err);
        callback(null, isMatch);
    });
};
// create and export the model class
exports.default = mongoose_1.model('Users', UserSchema);
