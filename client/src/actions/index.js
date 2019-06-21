import ky from 'ky';
import { AUTH_USER, AUTH_ERROR } from './types';

// register user action
export const register = (formProps, callback) => async (dispatch) => {
	ky
		.post('http://localhost:5000/register', { json: formProps })
		.json()
		.then((response) => {
			if (response.token) {
				dispatch({ type: AUTH_USER, payload: response.token });
				localStorage.setItem('as-token', response.token);
				callback();
			} else {
				dispatch({ type: AUTH_ERROR, payload: response.error });
			}
		})
		.catch((err) => console.log('our error', err));
};

// login user action
export const login = (formProps, callback) => async (dispatch) => {
	ky
		.post('http://localhost:5000/signin', { json: formProps })
		.json()
		.then((response) => {
			dispatch({ type: AUTH_USER, payload: response.token });
			localStorage.setItem('token', response.token);
			callback();
		})
		.catch((err) => {
			// dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials' });
			console.log(err);
		});
};

// todo setup logout action
