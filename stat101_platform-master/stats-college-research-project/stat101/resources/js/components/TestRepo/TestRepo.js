import React, { Component } from 'react';
import Nav from '../Nav';
import Header from '../Header';
import TestItem from './TestItem';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { connect } from 'react-redux';

class TestRepo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: [],
            filterText: "",
            searching: false,
            noTests: false
        }
        this.header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        };
    }

    checkIfNoTestsFound = () => {
        if (this.state.tests.length === 0) {
            this.setState({ noTests : true });
        } else {
            this.setState({ noTests : false });
        }
    }

    // get tests
    // if no tests are found display error message
    componentWillMount() {
        Axios.get('/api/tests', this.header).then((res) => this.setState({ tests: res.data }, this.checkIfNoTestsFound));
    }

    // call backend to get tests with matching topic
    filterByTopic = (e) => {
        e.preventDefault();
        const topic = $('#topicFilter').val();
        this.setState({ filterText: topic, searching: true } , () => {
            const opts = {
                topic: topic
            }
            if (topic == "") {
                Axios.get('/api/tests', this.header).then((res) => this.setState({ tests: res.data, searching: false }, 
                    this.checkIfNoTestsFound));
            } else {
                Axios.post('/api/tests/filter', opts, this.header).then((res) => {
                    this.setState({ tests: res.data, searching: false }, this.checkIfNoTestsFound);
                });
            }
        });
    }

    render() {
        const { searching, tests } = this.state;

        // const input = searching === false ? 
        //     <input id="topicFilter" onChange={(e) => this.filterByTopic(e)} className="form-control" type="text" placeholder="Search By Topic" aria-label="Search"/> :
        //     <input disabled={true} id="topicFilter" onChange={(e) => this.filterByTopic(e)} className="form-control" type="text" placeholder="Search By Topic" aria-label="Search"/>

        // transform tests data in state to React components
        let testItems = [];
        for (let i = 0; i < tests.length; i++) {
            let currTest = tests[i];
            testItems.push(<TestItem testName={currTest.name} topics={currTest.topics} key={currTest.id} id={currTest.id} 
                date={currTest.time}/>);
        }

        // display error message if no tests are found
        let noTestsErrorMsg = document.getElementById('noTestsMsg');
        if (noTestsErrorMsg !== null) {
            if (this.state.noTests) {
                noTestsErrorMsg.classList.remove('d-none');
            } else {
                noTestsErrorMsg.classList.add('d-none');
            }
        }

        return (
            <div>
                <Header title="Create and Edit Tests"/>
                <main>
                    <Nav/>
                    <div className="container">
                        <div className="d-flex flex-row">
                            <h2>Recent Tests</h2>
                            <div className="form-inline ml-auto flex-item">
                                {/* {input} */}
                                <input id="topicFilter" onChange={(e) => this.filterByTopic(e)} className="form-control" type="text" placeholder="Search By Topic" aria-label="Search"/>
                                <button className="btn ml-2 btn-primary">Search</button>
                            </div>
                        </div>
                        <Link to='teacher-tests/new-test'>
                            <button className="mt-3 mb-3 btn btn-lg btn-primary"> 
                                New Test
                            </button>
                        </Link>
                        <p id="noTestsMsg" className="text-secondary text-center d-none">No Tests found. Search for a different topic or add a new test.</p>
                        <div id="test-list" className="card-deck d-flex mt-3 flex-row flex-wrap">
                            {testItems}
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

export default connect(mapStateToProps, {})(TestRepo)
