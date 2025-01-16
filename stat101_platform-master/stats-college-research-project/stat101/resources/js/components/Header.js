import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signout } from '../actions/authActions';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            document.getElementById('signinNav').classList.remove('d-none');
            document.getElementById('signoutlink').classList.remove('d-none');
        }
    }

    logout = () => {
        this.props.signout();
        this.props.history.push('/signin');
    }

    render() {
        return (
            <header>
                <div className="jumbotron jumbotron-fluid bg-light">
                    <div className="container text-center">
                    <h1>{this.props.title}</h1>
                    </div>
                    <nav id="signinNav" className="navbar">
                        <ul className="navbar-nav d-flex flex-row ml-auto">
                            <li style={{cursor: "pointer"}} id="signoutlink" onClick={this.logout} className="d-none nav-item ml-3 text-secondary">
                                Sign Out
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, { signout })(withRouter(Header));
