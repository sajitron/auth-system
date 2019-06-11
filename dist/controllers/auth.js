"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.SECRET;
function tokenForUser(user) {
    return jsonwebtoken_1.default.sign({ user }, secret, {
        expiresIn: '100d'
    }, (_err, token) => {
        return token;
    });
}
function signin(req, res, _next) {
    // Passport knows what to do when we an email and a password on trying to sign in. it returns a user object on the request
    res.send({ token: tokenForUser(req.user) });
}
exports.signin = signin;
function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
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
            email,
            password
        });
        user.save((err) => {
            if (err)
                return next(err);
            // respond to request indicating user was created
            res.json({ token: tokenForUser(user) });
        });
    });
}
exports.signup = signup;
