import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

// todo check out using React with service workers

import App from './App';
import reducers from './reducers';
import HomePage from './pages/Home/home';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';

// * Allow for connection to redux dev tools

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducers,
	// the second parameter is the global state
	// * we are setting the token on the global state
	{
		auth: {
			authenticated: localStorage.getItem('token')
		}
	},
	composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App>
				<Route path="/" exact component={HomePage} />
				<Route path="/register" component={RegisterPage} />
				<Route path="/login" component={LoginPage} />
				<Route path="/dashboard" component={DashboardPage} />
			</App>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
