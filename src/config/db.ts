import { connect } from 'mongoose';

const db: any = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		await connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});

		console.log('MongoDB connected...');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
