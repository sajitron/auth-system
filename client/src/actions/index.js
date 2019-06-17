import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './types';

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
