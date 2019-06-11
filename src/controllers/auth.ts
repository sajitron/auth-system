import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET!;

function tokenForUser(user: any) {
	return jwt.sign(
		{ user },
		secret,
		{
			expiresIn: '100d'
		},
		(_err, token) => {
			return token;
		}
	);
}

export function signin(req: Request, res: Response, _next: NextFunction) {
	// Passport knows what to do when we an email and a password on trying to sign in. it returns a user object on the request
	res.send({ token: tokenForUser(req.user) });
}

export function signup(req: Request, res: Response, next: NextFunction) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) return res.status(422).send({ error: 'You must provide an email and a password' });

	// check password length
	if (password.length < 7) return res.status(422).send({ error: 'Password must be a minimum of 7 characters' });

	// check if user with same email exists
	User.findOne({ email }, (err, userExists) => {
		if (err) return next(err);

		// if a user with the email exists, return an error
		if (userExists) return res.status(422).send({ error: 'Email already taken' });

		// create new user if email is not taken
		const user = new User({
			email,
			password
		});

		user.save((err) => {
			if (err) return next(err);

			// respond to request indicating user was created
			res.json({ token: tokenForUser(user) });
		});
	});
}
