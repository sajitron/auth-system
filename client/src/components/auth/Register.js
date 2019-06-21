import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Register extends Component {
	onSubmit = (formProps) => {
		this.props.register(formProps, () => {
			this.props.history.push('/dahboard');
		});
	};

	render() {
		// destructure redux form handlesubmit from props
		const { handleSubmit } = this.props;

		return (
			<form onSubmit={handleSubmit(this.onSubmit)}>
				<fieldset>
					<label>First Name</label>
					<Field name="firstName" type="text" component="input" autoComplete="none" />
				</fieldset>
				<fieldset>
					<label>Last Name</label>
					<Field name="lastName" type="text" component="input" autoComplete="none" />
				</fieldset>
				<fieldset>
					<label>Email</label>
					<Field name="email" type="text" component="input" autoComplete="none" />
				</fieldset>
				<fieldset>
					<label>Password</label>
					<Field name="password" type="password" component="input" autoComplete="none" />
				</fieldset>
				<div>{this.props.errorMessage}</div>
				<button>Register</button>
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {
		errorMessage: state.auth.errorMessage
	};
}

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({
		form: 'register'
	})
)(Register);
