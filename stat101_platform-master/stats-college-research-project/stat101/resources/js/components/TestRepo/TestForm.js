import React, { Component } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Header from '../Header';
import Nav from '../Nav';
import Axios from 'axios';
import TestQuestionItem from './TestQuestionItem';
import TopicInput from './TopicInput';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class TestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testName: "",
            view: 1,
            topics: [],
            topicCount: 1,
            questionFilter: "",
            questionItems: [], // questions to be shown on screen
            questionEntityIds: [], // question_entity_ids to be linked to test
        };
        this.onAddQuestionBtnClick = this.onAddQuestionBtnClick.bind(this);
        this.onRemoveBtnClick = this.onRemoveBtnClick.bind(this);
        this.onTopicInputChange = this.onTopicInputChange.bind(this);
        this.removeTopic = this.removeTopic.bind(this);
        this.header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        };
    }

    componentWillMount() {
        // check if page is Edit Test page
        let path = this.props.location.pathname;
        if (path.includes('edit-test')) {
            Axios.get('/api/tests/edit-test/' + this.props.match.params.test_id).then((res) => {
                let data = res.data;
                document.getElementById('testName').value = data['name'];
                document.getElementById('questions').classList.remove('d-none');
                this.setState({
                    questionEntityIds : data['question_entity_ids'],
                    testName: data['name'],
                    topics: data['topics'],
                    topicCount: data['topics'].length
                });
                this.getQuestions();
            })
        }
    }

    // function to be called when either topic or question body changes
    // changes the appropriate state to match user's input
    // state: name of state field to change
    // value: the value to reassign the field
    onTextChange = (state, value) => {
        this.setState({ [state] : value });
    }

    // called when user presses "Next" button
    // displays list of questions user can add to the test
    onNextBtnClick = (e) => {
        e.preventDefault();
        if (this.state.testName === "" || this.state.testTopic === "") {
            alert("please fill out all fields");
        } else {
            // disable inputs
            document.getElementById('questions').classList.remove('d-none');
            this.getQuestions();
        }
    }

    // get up to 40 questions
    getQuestions = () => {
        
        Axios.get('/api/all_questions', this.header).then((res) => {
            this.setState({ questionItems: res.data });
        });
    }

    // handles search bar text change
    onTopicFilterChange = () => {

        this.setState(
            // sets text filter state to match user input
            { questionFilter: document.getElementById('questionFilter').value },
            () => {
                // if the search bar is null get all questions
                if (this.state.questionFilter === "") {
                    Axios.get('/api/all_questions', this.header)
                    .then(res => this.setState({ questionItems: res.data }));
                } else { // search for questions like the user input
                    Axios.get('/api/filter/' + this.state.questionFilter)
                    .then(res => this.setState({ questionItems : res.data }));
                }
            }
        );

    }

    // adds quesiton_entity_id to state
    onAddQuestionBtnClick(questionEntityId) {
        let newArr = this.state.questionEntityIds.slice();
        newArr.push(questionEntityId);
        this.setState({ questionEntityIds: newArr });
    }

    // removes question_entity_id from state
    onRemoveBtnClick(questionEntityId) {
        let newArr = this.state.questionEntityIds.slice();
        let index = newArr.indexOf(questionEntityId);
        newArr.splice(index, 1);
        this.setState({ questionEntityIds: newArr });
    }

    // add a new topic input to the view
    addTopic = (e) => {
        e.preventDefault();
        const count = this.state.topicCount;
        this.setState({ topicCount: count + 1 })
    }

    // updates state to match topic input values
    onTopicInputChange(key, value) {
        const {topics} = this.state;

        const newArr = [...topics];
        newArr[key] = value;

        this.setState({ topics: newArr });
    }

    // removes given topic from state
    removeTopic(e, topic) {
        e.preventDefault();
        
        const { topics, topicCount } = this.state;

        let newArr = [...topics];
        newArr = newArr.filter((tag) => {
            return tag !== topic;
        });

        const newCount = topicCount - 1;

        this.setState({ topics: newArr, topicCount: newCount});
    }

    // sends test form data to database
    // logs out response
    onTestFormSubmit = (e) => {
        e.preventDefault();

        const { topics, testName, questionEntityIds } = this.state;

        // POST body
        let opts = {
            topics: topics,
            testName: testName,
            questions: questionEntityIds,
            teacher_id: localStorage.getItem('user_id')
        };

        if (this.props.location.pathname.includes('edit-test')) {
            axios.post('/api/update-test/1', opts, this.header).then((res) => {
                document.getElementById('newTest').classList.add('d-none');
                document.getElementById('successMsg').classList.remove('d-none');
            })
            .catch((err) => {
                document.getElementById('newTest').classList.add('d-none');
                document.getElementById('errorMsg').classList.remove('d-none');
            });
        } else {
            // store the data in the database and display the appropriate response
            axios.post('/api/tests', opts, this.header).then((res) => {
                document.getElementById('newTest').classList.add('d-none');
                document.getElementById('successMsg').classList.remove('d-none');
            })
            .catch((err) => {
                document.getElementById('newTest').classList.add('d-none');
                document.getElementById('errorMsg').classList.remove('d-none');
            });
        }
    }

    onViewModeSelected = () => {
        if (this.state.view === 1) {
            this.setState({view: 0});
        } else {
            this.setState({view: 1});
        }
    }

    render() {
        const { questionItems, questionEntityIds, topicCount, topics } = this.state;

        let questionList = [];
        for (let i = 0; i < this.state.questionItems.length; i++) {
            let currQuestion = questionItems[i]; 
            // key is "question_entity_id" in ItemBank Model
            let clicked = false;
            if (questionEntityIds.includes(currQuestion.key)) {
                clicked = true;
            }
            questionList.push(<TestQuestionItem 
                onRemoveBtnClick={this.onRemoveBtnClick} 
                clicked={clicked}
                onAddQuestionBtnClick={this.onAddQuestionBtnClick} 
                key={currQuestion.key} 
                id={currQuestion.key} 
                topics={currQuestion.topics} 
                desc={currQuestion.questionText}
                />);
        }

        // if (this.state.view === 1) {
        //     viewMode = <div id="question-list" className="card-deck d-flex mt-3 flex-column flex-wrap">
        //                 {questionList}   
        //                 </div>
        // } else if (this.state.view === 2) {
        //     viewMode = <div id="question-list" className="card-deck d-flex mt-3 flex-column flex-wrap">
        //                 {questionList}   
        //                 </div>
        // }

        let path = this.props.location.pathname;
        let header = <Header title="New Test"/>;
        if (path.includes('edit-test')) {
            header = <Header title="Edit Test"/>;
        }

        let questionCount = document.getElementById('questionCount');
        if (questionCount !== null) {
            questionCount.innerText = questionEntityIds.length + " question(s) added";
        }

        let topicInputs = [];
        for (let i = 0; i < topicCount; i++) {
            topicInputs.push(<TopicInput remove={this.removeTopic} value={topics[i] || ""} changeThisTopic={this.onTopicInputChange} count={i} key={i}/>);
        }

        return (
            <div>
                {header}
                <main>
                    <Nav/>
                    <div id="newTest" className="bg-light container">
                        <form className="mb-2 mt-2">
                            <div className="form-group d-flex flex-column">
                                <label htmlFor="testName">Test Name</label>
                                <input onChange={() => {
                                    let name = document.getElementById('testName').value;
                                    this.onTextChange("testName", name);
                                }} name="testName" className="form-control" type="text" id="testName" aria-describedby="test name" placeholder="Ex: Unit 1 Test"/>
                            </div>
                            <div className="form-group d-flex flex-column">
                                <label htmlFor="testTopic">Topic(s)</label>
                                {topicInputs}
                                <button onClick={this.addTopic} className="btn btn-primary mt-3 w-25">Add Topic</button>
                            </div>
                            <div className="form-group">
                                <button onClick={this.onNextBtnClick} className="btn btn-primary">Next</button>
                            </div>
                            <div id="questions" className='d-none'>
                                <div className="form-group">
                                    <label htmlFor="questionFilter">Filter By Question Topic</label>
                                    <input onChange={this.onTopicFilterChange} name="questionFilter" className="form-control" type="text" id="questionFilter" aria-describedby="question filter" placeholder="Ex: z-scores"/>
                                </div>
                                <p id="questionCount" className="text-info">0 questions added</p>
                                <div className="form-group">
                                    <button className="btn btn-primary mt-3 w-25" onClick={this.onViewModeSelected}>switch view mode</button>

                                    {this.state.view === 0 ? (
                                        <div id="question-list" className="card-deck d-flex mt-3 flex-column flex-wrap">
                                            {questionList}   
                                        </div>
                                    ) : (
                                        <div id="question-list" className="card-deck d-flex mt-3 flex-row flex-wrap">
                                            {questionList}   
                                        </div>
                                    )}


                                </div>
                                <div className="form-group mt-5">
                                    <button onClick={this.onTestFormSubmit} className="btn btn-primary btn-lg">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="successMsg" className="d-none container">
                        <p className="text-success mt-3">
                            Test added successfully! Click below to go back to the tests page.
                        </p>
                        <Link to='/teacher-tests'>
                            <button className="btn btn-primary mt-2">Create/Edit Tests</button>
                        </Link>
                    </div>
                    <div id="errorMsg" className="d-none bg-light">
                        <p className="text-danger">
                            There was a problem adding your test. Please try again later.
                        </p>
                        <Link to='/teacher-tests'>
                            <button className="btn btn-primary btn-lg mt-2">Create/Edit Tests</button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default  connect(mapStateToProps, {})(withRouter(TestForm));
