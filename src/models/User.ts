import { Schema, SchemaTypes, Document, model } from 'mongoose';

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	logNumber: number;
}

export interface UserDocument extends User, Document {
	id: string;
}

const UserSchema = new Schema({
	firstName: {
		type: SchemaTypes.String
	},
	lastName: { type: SchemaTypes.String },
	email: {
		type: SchemaTypes.String,
		unique: true
	},
	logNumber: { type: SchemaTypes.Number }
});

export default model<UserDocument>('Users', UserSchema);
