import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

export default class Nav extends Component {

    render() {
        return (
            <nav className="d-flex flex-column">
                <NavLink exact to='/teacher-home' activeStyle={{
                    backgroundColor: "white"
                }}>
                    <div className="text-center mt-4 navItem">
                        <img src="/imgs/home.png" alt="home"/>
                        <p className="text-dark">Home</p>
                    </div>
                </NavLink>
                <NavLink exact to='/teacher-tests' activeStyle={{
                    backgroundColor: "white"
                }}>
                    <div className="text-center navItem">
                        <img className="navLink" src="/imgs/test.png" alt="create, edit, and publish tests"/>
                        <p className="text-dark">Create/Edit Tests</p>
                    </div>
                </NavLink>
                <NavLink exact to='/teacher-question-repo' activeStyle={{
                    backgroundColor: "white"
                }}>
                    <div className="text-center navItem">
                        <img className="navLink" src="/imgs/add.png" alt="create, edit, and publish tests"/>
                        <p className="text-dark">Create/Edit Questions</p>
                    </div>
                </NavLink>
            </nav>
        );
    }
}
