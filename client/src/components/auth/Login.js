import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Login extends Component {
	onSubmit = (formProps) => {
		// formProps contains a user's input
		this.props.login(formProps, () => {
			this.props.history.push('/dashboard');
			// redirect on submit
		});
	};
	render() {
		// destructure handleSubmit from props via reduxForm
		const { handleSubmit } = this.props;
		return (
			<form onSubmit={handleSubmit(this.onSubmit)}>
				<fieldset>
					<label>Email</label>
					<Field name="email" type="text" component="input" autoComplete="none" />
				</fieldset>
				<fieldset>
					<label>Password</label>
					<Field name="password" type="password" component="input" autoComplete="none" />
				</fieldset>
				<div>{this.props.errorMessage}</div>
				<button>Login</button>
			</form>
		);
	}
}

function mapStateToProps(state) {
	return { errorMessage: state.auth.errorMessage };
}

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({
		form: 'login'
	})
)(Login);
