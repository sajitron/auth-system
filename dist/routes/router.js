"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
require('../services/passport');
// import passportService from '../services/passport';
dotenv_1.default.config();
// we do not want sessions, just tokens
const requireAuth = passport_1.default.authenticate('jwt', { session: false });
const requireSignin = passport_1.default.authenticate('local', { session: false });
function router(app) {
    app.post('/register', auth_1.signup);
    app.get('/', requireAuth, function (req, res) {
        res.send({ YES: 'It Works!' });
    });
    app.post('/signin', (req, res) => {
        passport_1.default.authenticate('local', { session: false }, (error, user) => {
            if (error || !user)
                res.send({ error });
            // this is what ends up in our JWT
            const payload = {
                email: user.email,
                expires: '100d'
            };
            // assign payload to req.user
            req.login(payload, { session: false }, (error) => {
                if (error)
                    res.send({ error });
                User_1.default.findOne({ email: user.email }, function (err, userDetail) {
                    if (err)
                        res.send({ error: 'Could not get user' });
                    // if maximum amount of users logged in, reject the login
                    if (userDetail.logNumber >= process.env.MAX_LOGIN) {
                        res.send({ error: 'Maximum amount of users logged in' });
                    }
                    else {
                        // increase the logNumber by 1
                        User_1.default.findByIdAndUpdate({ _id: user._id }, { $inc: { logNumber: 1 } }).exec();
                        // generate a signed token and return in the response
                        const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), process.env.SECRET);
                        // todo check out how to use cookies properly
                        // asign our jwt to the cookie
                        res.cookie('jwt', token, { httpOnly: true, secure: true });
                        res.status(200).send({ token });
                    }
                });
            });
        })(req, res);
    });
    app.get('/signout', requireAuth, auth_1.reduceLogNumber);
}
exports.default = router;
