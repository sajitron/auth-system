import ky from 'ky';
import { AUTH_USER, AUTH_ERROR } from './types';

// register user action
export const register = (formProps, callback) => async (dispatch) => {
	const response = await ky.post('http//localhost:5000/register', { json: formProps }).json();

	console.log(response);
	// try {
	// 	dispatch({ type: AUTH_USER, payload: response.data.token });
	// 	localStorage.setItem('as-token', response.data.token);
	// 	callback();
	// } catch (error) {
	// 	dispatch({ type: AUTH_ERROR, payload: response.data.error });
	// }
};

// login user action
export const login = (formProps, callback) => async (dispatch) => {
	const response = await ky.post('http://localhost:5000/signin', formProps);

	try {
		dispatch({ type: AUTH_USER, payload: response.data.token });
		localStorage.setItem('as-token', response.data.token);
		callback();
	} catch (error) {
		dispatch({ type: AUTH_ERROR, payload: response.data.error });
	}
};

// todo setup logout action