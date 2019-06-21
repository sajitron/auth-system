"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = __importDefault(require("passport-local"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport = require("passport");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
// initialize env variables
dotenv_1.default.config();
// create local strategy
const LocalStrategy = passport_local_1.default.Strategy;
const localOptions = { usernameField: 'email', passwordField: 'password' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
    // verify this username and password, call done with the user..
    // if it is the correct email and password
    // otherwise, call done with false
    try {
        const user = yield User_1.default.findOne({ email: email.toLowerCase() }).exec();
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (passwordMatch) {
            return done(null, user);
        }
        else {
            return done('Incorrect email and/or password');
        }
    }
    catch (error) {
        console.log('passport error', error);
        return done('Invalid email');
    }
}));
// setup options for JWT strategy
const jwtOptions = {
    // tell passport to get the token from authorization header with Bearer prefix
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};
// create the JWT strategy
const jwtLogin = new passport_jwt_1.Strategy(jwtOptions, function (jwtPayload, done) {
    // check if token has expired, else return payload
    if (Date.now() > jwtPayload.expires) {
        return done('Token expired');
    }
    return done(null, jwtPayload);
});
// Instruct passport to use the strategies
passport.use(localLogin);
passport.use(jwtLogin);
