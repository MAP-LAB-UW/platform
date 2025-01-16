import React, { Component } from 'react';

import { connect } from 'react-redux';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// Custom React component imports
import QuestionRepo from './components/QuestionRepo/QuestionRepo.js';
import TeacherHome from './components/TeacherHome';
import TestRepo from './components/TestRepo/TestRepo.js';
import TeacherMonitor from './components/Monitor/TeacherMonitor';
import StudentHome from './components/StudentHome/StudentHome';
import StudentTest from './components/StudentTest/StudentTest';
import EditQuestion from './components/EditQuestion/EditQuestion.js';
import TestForm from './components/TestRepo/TestForm';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';

// determines what gets rendered at each route
class Index extends Component {
    constructor(props) {
        super(props);
    }

    PrivateTeacherRoute = ({component: Component, ...rest}) => { 
        return(
            <Route pathName={window.location.pathname} {...rest} render={(props) => (
                this.props.auth.isAuthenticated === true && this.props.auth.userType === "teacher"
                    ? <Component {...props} />
                    : <Redirect to='/signin'/>
            )}/>        
        );
    }

    PrivateStudentRoute = ({component: Component, ...rest}) => {
        return(
            <Route {...rest} render={(props) => (
                this.props.auth.isAuthenticated === true && this.props.auth.userType === "student"
                    ? <Component {...props} />
                    : <Redirect to='/signin'/>
            )}/>
        )
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={() => <Redirect to='/signin'/>}/>
                    <this.PrivateTeacherRoute exact path='/teacher-question-repo' component={QuestionRepo}/>
                    <this.PrivateTeacherRoute exact path='/teacher-home' component={TeacherHome}/>
                    <this.PrivateTeacherRoute exact path='/teacher-monitor' component={TeacherMonitor}/>
                    <this.PrivateTeacherRoute exact path='/teacher-tests' component={TestRepo}/>
                    <this.PrivateStudentRoute exact path='/student-home' component={StudentHome}/>
                    <this.PrivateStudentRoute exact path='/student-test/:testInstance/:questionNumber' component={StudentTest}/>
                    <this.PrivateTeacherRoute exact path='/edit-question/:item_id' component={EditQuestion}/>
                    <this.PrivateTeacherRoute exact path='/teacher-tests/new-test' component={TestForm}/>
                    <this.PrivateTeacherRoute exact path='/teacher-tests/edit-test/:test_id' component={TestForm}/>
                    <this.PrivateTeacherRoute exact path='/monitor/:testId' component={TeacherMonitor}/>
                    <Route exact path='/signin' render={() => <SignIn login={this.login} logout={this.logout}/>}/>
                    <Route exact path='/signup' component={SignUp}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(Index);
