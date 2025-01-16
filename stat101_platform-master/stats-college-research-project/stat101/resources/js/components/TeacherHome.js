import React, { Component } from 'react';
import Header from './Header';
import Nav from './Nav';
import { Link } from 'react-router-dom';

export default class TeacherHome extends Component {
    render() {
        return (
            <div>
                <Header title="Home"/>
                <main>
                    <Nav path={this.props.location.pathname}/>
                    <div id="teacher-home" className="container">
                        <div className="card-deck d-flex justify-content-around ml-auto mr-auto mt-5">
                            <div className="card">
                                <Link to='teacher-tests'>
                                    <div className="text-center mt-1">
                                        <img src="imgs/test.png" alt="test"/>
                                    </div>
                                    <div className="card-body">
                                        <h4 className="card-title">Create, Edit, and Publish Tests</h4>
                                    </div>
                                </Link>
                            </div>
                            <div className="card">
                                <Link to='teacher-question-repo'>
                                    <div className="text-center mt-1">
                                        <img src="imgs/add.png" alt="monitor"/>
                                    </div>
                                    <div className="card-body">
                                        <h4 className="card-title">Make and Edit Questions</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}
