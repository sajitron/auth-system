import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import passportLocal from 'passport-local';
import dotenv from 'dotenv';
import passport = require('passport');
import User from '../models/User';

// initialize env variables
dotenv.config();

// create local strategy
const LocalStrategy = passportLocal.Strategy;
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email: string, password: string, done: any) {
	// verify this username and password, call done with the user..
	// if it is the correct email and password
	// otherwise, call done with false
	User.findOne({ email })
		.then((user) => {
			if (!user) return done(null, false);

			// compare passwords
			user.schema.methods.comparePassword(password, function(err: any, isMatch: any) {
				if (err) return done(err);

				if (!isMatch) return done(null, false);

				return done(null, user);
			});
		})
		.catch(done);
});

// setup options for JWT strategy
const jwtOptions = {
	// tell passport to get the token from an authorization header
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: process.env.SECRET
};

// create the JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// payload is the decoded jwt token (userid & issuetime)
	// see if the user id in the payload exists in our database
	// if it does, call 'done' with the user object
	// otherwise, call done without a user object

	User.findById(payload.sub, function(err, user) {
		if (err) return done(err, false);

		if (!user) return done(null, false);

		return done(null, user);
	});
});

// Instruct passport to use the strategies
passport.use(jwtLogin);
passport.use(localLogin);
