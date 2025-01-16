import React, { Component } from 'react';
import Nav from '../Nav';
import Header from '../Header';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import TableRow from './TableRow';
import Loading from '../Loading';

class TeacherMonitor extends Component {
    constructor(props) {
        super(props);
        // POST header
        this.state = {
            tableData: []
        }
        this.header =  {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }
    }

    // get initial test data
    componentDidMount() {
        const opts = {
            id: this.props.match.params.testId
        }

        axios.post('/api/monitor-test', opts, this.header).then((res) => {
            this.setState({ tableData: res.data });
        });
    }

    render() {

        const { tableData } = this.state;

        if (tableData.length == 0) {
            return <Loading/>
        }

        const { testName, totalQuestions, students } = tableData;

        // make all table rows
        const rows = [];
        for (let i = 0; i < students.length; i++) {
            const currStudent = students[i];
            if (currStudent.started) {
                rows.push(<TableRow key={i} name={currStudent.name} correct={currStudent.correct} incorrect={currStudent.incorrect}/>);
            } else {
                rows.push(<TableRow key={i} name={currStudent.name} correct={0} incorrect={0}/>);
            }
            
        }

        return (
            <div>
                <Header title="Monitor Tests"/>
                <main>
                    <Nav path={this.props.location.pathname}/>
                    <div className="container">
                        <h2 className="table-test-name text-center">{testName}</h2>
                        <table className="table ml-5 pl-5 mb-5 mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">Name (Last, First)</th>
                                    <th scope="col"># Questions Answered</th>
                                    <th scope="col"># Correct</th>
                                    <th scope="col"># Incorrect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                <th scope="row">Appleseed, Johnny</th>
                                <td class="text-warning">18/36</td>
                                <td>8</td>
                                <td>10</td>
                                </tr>
                                <tr>
                                <th scope="row">Doe, John</th>
                                <td class="text-warning">18/36</td>
                                <td>8</td>
                                <td>10</td>
                                </tr>
                                <tr>
                                <th scope="row">Jane, Mary</th>
                                <td class="text-danger">0/36</td>
                                <td>0</td>
                                <td>0</td>
                                </tr>
                                <tr>
                                <th scope="row">Zuckerburg, Mark</th>
                                <td class="text-success">Complete</td>
                                <td>36</td>
                                <td>0</td>
                                </tr> */}
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(withRouter(TeacherMonitor));
