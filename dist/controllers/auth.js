"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
function signup(req, res, next) {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password)
        return res.status(422).send({ error: 'You must provide an email and a password' });
    // check password length
    if (password.length < 7)
        return res.status(422).send({ error: 'Password must be a minimum of 7 characters' });
    // check if user with same email exists
    User_1.default.findOne({ email }, (err, userExists) => {
        if (err)
            return next(err);
        // if a user with the email exists, return an error
        if (userExists)
            return res.status(422).send({ error: 'Email already taken' });
        // create new user if email is not taken
        const user = new User_1.default({
            firstName,
            lastName,
            email,
            password
        });
        user.save((err) => {
            if (err)
                return next(err);
            const payload = {
                email: user.email,
                expires: '100d'
            };
            // generate a signed token and return in the response
            const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), process.env.SECRET);
            // asign our jwt to the cookie
            // res.cookie('jwt', token, { httpOnly: true, secure: true });
            // respond to request indicating user was created
            res.json({ firstName, lastName, email, token });
        });
    });
}
exports.signup = signup;
function reduceLogNumber(req, res, _next) {
    const { email } = req.user;
    User_1.default.findOneAndUpdate({ email }, { $inc: { logNumber: -1 } }, (err, _user) => {
        if (err)
            res.status(422).send({ error: 'Unable to logout user' });
        res.status(200).send({ status: 'success' });
    });
}
exports.reduceLogNumber = reduceLogNumber;
