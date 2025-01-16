import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import { runInThisContext } from 'vm';

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            userType: ''
        };
    }

    componentWillMount() {
        this.setState({ userType: 'Teacher' });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, passwordConfirmation, userType} = this.state;
        axios.post('/api/register', {
            name,
            email,
            password,
            passwordConfirmation,
            userType
          })
          .then(response=> {
            localStorage.setItem('user', response.data.token);
            this.setState({err: false});
           if (userType == "Teacher") {
                this.props.history.push("/teacher-home");
           } else {
                this.props.history.push("/student-home");
           }
           
          })
          .catch(error=> {
            this.refs.name.value = "";
            this.refs.userType.value="";
            this.refs.password.value="";
            this.refs.email.value="";
            this.refs.confirm.value="";
            this.setState({err: true});
          });
     }

     onChange = (e) => {
        const {name, value} = e.target ;
        this.setState({[name]: value});
     }


    render() {
        let error = this.state.err ;
        let msg = (!error) ? 'Registered Successfully' : 'Oops! , Something went wrong.' ;
        let name = (!error) ? 'alert alert-success' : 'alert alert-danger' ;

        return (
            <div>
                <Header title="Sign Up" showSignInlink={false}/>
                <main className="container">
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input onChange={this.onChange} ref="email" name="email" type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input onChange={this.onChange} ref="name" name="name" type="text" className="form-control" id="name" placeholder="Ex: John Doe"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="userType">Are you a student or Teacher?</label>
                            <select ref="userTy[e" name="userType" onChange={this.onChange} className="form-control" id="userType">
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={this.onChange} ref="password" name="password" type="password" className="form-control" id="password" placeholder="Password"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordConfirmation">Confirm Password</label>
                            <input onChange={this.onChange} type="password" name="passwordConfirmation" ref="passwordConfirmation" className="form-control" id="passwordConfirmation" placeholder="Password"/>
                        </div>
                        <button onClick={this.onSubmit} type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </main>
            </div>
        )
    }
}
