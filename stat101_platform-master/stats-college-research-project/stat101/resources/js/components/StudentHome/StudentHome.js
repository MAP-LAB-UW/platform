import React, { Component } from 'react';
import Header from '../Header';
import axios from 'axios';
import StudentTestitem from './StudentTestItem';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class StudentHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: []
        }
    }

    componentWillMount() {
        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }

        const { user_id } = this.props.auth;

        axios.post('/api/student-tests/', { id: user_id }, header).then(res => this.setState({ tests: res.data }));
    }

    render() {
        const {tests} = this.state;
        let noTestMsg = "";
        let testCards = [];

        if (tests.length === 0) {
            noTestMsg = <p className="text-secondary">Wait for the instructor to publish a test</p>
        } else {
            for (let i = 0; i < tests.length; i++) {
                testCards.push(<StudentTestitem key={tests[i].id} id={tests[i].id} title={tests[i].name} date={tests[i]["due_date"]}
                    started={tests[i].started} />);
            }
        }

        return (
            <div>
                <Header title="Home"/>
                <main>
                    <div className="container">
                        {noTestMsg}
                        <div className="card-deck d-flex mt-2">
                            {testCards}
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(withRouter(StudentHome));
