"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = __importDefault(require("passport-local"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport = require("passport");
const User_1 = __importDefault(require("../models/User"));
// initialize env variables
dotenv_1.default.config();
// create local strategy
const LocalStrategy = passport_local_1.default.Strategy;
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    // verify this username and password, call done with the user..
    // if it is the correct email and password
    // otherwise, call done with false
    User_1.default.findOne({ email })
        .then((user) => {
        if (!user)
            return done(null, false);
        // compare passwords
        user.schema.methods.comparePassword(password, function (err, isMatch) {
            if (err)
                return done(err);
            if (!isMatch)
                return done(null, false);
            return done(null, user);
        });
    })
        .catch(done);
});
// setup options for JWT strategy
const jwtOptions = {
    // tell passport to get the token from an authorization header
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET
};
// create the JWT strategy
const jwtLogin = new passport_jwt_1.Strategy(jwtOptions, function (payload, done) {
    // payload is the decoded jwt token (userid & issuetime)
    // see if the user id in the payload exists in our database
    // if it does, call 'done' with the user object
    // otherwise, call done without a user object
    User_1.default.findById(payload.sub, function (err, user) {
        if (err)
            return done(err, false);
        if (!user)
            return done(null, false);
        return done(null, user);
    });
});
// Instruct passport to use the strategies
passport.use(jwtLogin);
passport.use(localLogin);
