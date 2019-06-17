import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './types';

// register user action
export const register = (formProps, callback) => async (dispatch) => {
	try {
		const response = await axios.post('http//localhost:5000/register', formProps);

		dispatch({ type: AUTH_USER, payload: response.data.token });
		localStorage.setItem('as-token', response.data.token);
		callback();
	} catch (error) {
		dispatch({ type: AUTH_ERROR, payload: 'An Error Occured' });
	}
};

// login user action
export const login = (formProps, callback) => async (dispatch) => {
	try {
		const response = await axios.post('http://localhost:5000/signin', formProps);

		dispatch({ type: AUTH_USER, payload: response.data.token });
		localStorage.setItem('as-token', response.data.token);
		callback();
	} catch (error) {
		dispatch({ type: AUTH_ERROR, payload: 'Invalid credentials' });
	}
};

// todo setup logout action
