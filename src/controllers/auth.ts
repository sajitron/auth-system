import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export function signup(req: Request, res: Response, next: NextFunction) {
	const { email, password, firstName, lastName } = req.body;

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
			firstName,
			lastName,
			email,
			password
		});

		user.save((err) => {
			if (err) return next(err);

			// respond to request indicating user was created
			res.json({ firstName, lastName, email });
		});
	});
}
