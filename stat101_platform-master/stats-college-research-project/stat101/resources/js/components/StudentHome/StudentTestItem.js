import React, { Component } from 'react';
import { startTest, resumeTest } from '../../actions/takeTestActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class StudentTestItem extends Component {
    constructor(props) {
        super(props);
    }

    // redirect to first question when redux state is done updating
    componentDidUpdate() {
        const { takeTest, history, id } = this.props;

        if (takeTest.fetched) {
            history.push('/student-test/' + id + '/' + 1);
        }
    }

    // called when user clicks start test button
    // starts or resumes the test
    startThisTest = (e) => {
        e.preventDefault();

        const { id, started, startTest, resumeTest } = this.props;
        const { token, user_id } = this.props.auth;

        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + token    
            }
        }

        started ? resumeTest(header, id, user_id, true) : startTest(header, id, user_id, true);
    }

    render() {
        const {title, date, started} = this.props;
        let btn = <button onClick={this.startThisTest} className="btn btn-primary mt-3">Start Test</button>;
        if (started) {
            btn = <button onClick={this.startThisTest} className="btn btn-success mt-3">Resume Test</button>
        }

        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h6 className="card-subtitle">{"Due " + date}</h6>
                    {btn}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, { startTest, resumeTest })( withRouter(StudentTestItem));
