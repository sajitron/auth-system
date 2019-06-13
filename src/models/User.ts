import { Schema, SchemaTypes, Document, model } from 'mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	logNumber: number;
}

export interface UserDocument extends User, Document {
	id: string;
	password: string;
}

const UserSchema = new Schema({
	firstName: {
		type: SchemaTypes.String,
		required: true
	},
	lastName: {
		type: SchemaTypes.String,
		required: true
	},
	email: {
		type: SchemaTypes.String,
		unique: true,
		lowercase: true,
		required: true
	},
	password: {
		type: SchemaTypes.String,
		required: true
	},
	logNumber: { type: SchemaTypes.Number, default: 1, min: 0 }
});

// hash password before saving user
UserSchema.pre<UserDocument>('save', function(next: NextFunction) {
	const user = this;

	// generate a salt and run the callback
	bcrypt.genSalt(10, function(err: any, salt: string) {
		if (err) return next(err);

		// encrypt the password using the salt
		bcrypt.hash(user.password, salt, function(err: any, hash: string) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(userPassword: string, callback: any) {
	bcrypt.compare(userPassword, this.password, function(err, isMatch) {
		if (err) return callback(err);

		callback(null, isMatch);
	});
};

// create and export the model class
export default model<UserDocument>('Users', UserSchema);
