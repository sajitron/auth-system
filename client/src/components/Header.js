import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component {
	renderLinks() {
		return (
			<div>
				<Link to="/register">Register</Link>
				<Link to="/login">Login</Link>
				<Link to="/home">Home</Link>
			</div>
		);
	}

	render() {
		return (
			<div>
				<Link to="/">Auth System</Link>
				{this.renderLinks()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(Header);

// export default Header;
