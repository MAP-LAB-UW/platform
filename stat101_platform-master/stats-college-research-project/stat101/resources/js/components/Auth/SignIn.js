import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signin } from '../../actions/authActions';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    signin = (e) => {
        e.preventDefault();
        const {email, password} = this.state;

        axios.post('/api/login', {email: email, password: password}).then((res) => {
            const {userType, name, user_id, token} = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('userType', userType);
            localStorage.setItem('user_id', user_id);
            this.props.signin(name, user_id, token, userType);
            // this.props.login(userType, name, user_id);
            if (userType === "teacher") {
                this.props.history.push('/teacher-home');
            } else if (userType === "student") {
                this.props.history.push('/student-home');
            }
        }).catch((err) => {
            console.log(err);
        });

        
    }

    onChange = (e) => {
        const {name, value} = e.target ;
        this.setState({[name]: value});
     }

    render() {
        return (
            <div>
                <Header title="Sign In" showSignInlink={false}/>
                <main className="container">
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input onChange={this.onChange} name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input onChange={this.onChange} name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                        </div>
                        <button onClick={this.signin} type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <Link to="/signup">
                        <small>Click here to register if you don't have an account</small>
                    </Link>
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => ({...state})

export default connect(mapStateToProps, { signin })(withRouter(SignIn));
