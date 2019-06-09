import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import path from 'path';
import helmet = require('helmet');

// Initialize configuration
dotenv.config();

const app: Application = express();

// Secure app
app.use(helmet());

// Connecr Database
connectDB();

// Initialize middleware
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// log all requests
app.use(morgan('combined'));

// allow cross origin requests
app.use(cors());

// serve static files in production environment
if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static(path.join(__dirname, '../', 'client/build')));

	app.get('*', (req: Request, res: Response) => {
		res.sendFile(path.join(__dirname, '../', 'client/build/index.html'));
	});
}
// * Setup api routes here

// serve static files in dev environment
app.use(express.static(path.join(__dirname, '../', 'dist')));

// serve default file on some error
app.get('/*', (req: Request, res: Response) => {
	res.sendfile('index.html', { root: path.join(__dirname, '../', './dist') });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
