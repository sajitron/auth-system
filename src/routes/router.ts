import passport from 'passport';
import { signup, reduceLogNumber } from '../controllers/auth';
import { Application, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
require('../services/passport');
// import passportService from '../services/passport';

dotenv.config();

// we do not want sessions, just tokens
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

export default function router(app: Application) {
	app.post('/register', signup);

	app.get('/', requireAuth, function(req: Request, res: Response) {
		res.send({ YES: 'It Works!' });
	});

	app.post('/signin', requireSignin, (req: Request, res: Response) => {
		passport.authenticate('local', { session: false }, (error: Error, user: any) => {
			if (error || !user) res.status(400).json({ error });

			// this is what ends up in our JWT
			const payload = {
				email: user.email,
				expires: '100d'
			};

			// assign payload to req.user
			req.login(payload, { session: false }, (error: Error) => {
				if (error) res.status(400).send({ error });

				User.findOne({ email: user.email }, function(err: Error, userDetail: any) {
					if (err) res.status(422).send({ error: 'Could not get user' });

					// if maximum amount of users logged in, reject the login
					if (userDetail.logNumber >= process.env.MAX_LOGIN!) {
						res.status(422).send({ error: 'Maximum amount of users logged in' });
					} else {
						// increase the logNumber by 1
						User.findByIdAndUpdate({ _id: user._id }, { $inc: { logNumber: 1 } }).exec();
						// generate a signed token and return in the response
						const token = jwt.sign(JSON.stringify(payload), process.env.SECRET!);

						// todo check out how to use cookies properly
						// asign our jwt to the cookie
						res.cookie('jwt', token, { httpOnly: true, secure: true });
						res.status(200).send({ token });
					}
				});
			});
		})(req, res);
	});

	app.get('/signout', requireAuth, reduceLogNumber);
}
