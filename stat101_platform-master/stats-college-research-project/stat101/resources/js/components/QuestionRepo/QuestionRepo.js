import React, { Component } from 'react';
import Nav from '../Nav';
import Header from '../Header';
import QuestionItem from './QuestionItem';
import NewQuestionForm from './NewQuestionForm';
import Axios from 'axios';
import { connect } from 'react-redux';

class QuestionRepo extends Component {
    constructor() {
        super();
        this.toggleForm = this.toggleForm.bind(this);
        this.cancelButton = (
            <button onClick={this.toggleForm} key="cancelBtn" className="mt-3 mb-3 btn btn-lg btn-danger">Cancel</button>
        );
        this.newQuestionButton = (
            <button onClick={this.toggleForm} key="newQuestionBtn" className="mt-3 mb-3 btn btn-lg btn-primary">New Question</button>
        );
        this.viewButton = (
            <button onClick={this.toggleForm} key="viewBtn" className="mt-3 mb-3 btn btn-lg btn-primary">View Mode</button>
        );
        this.state = {
            questions: [],
            topicFilterText: "",
            isFormHidden: true,
            isCancelBtn: false,
            noQuestionsFound: false
        };
    }
    
    // show all questions
    // if there are no questions to show display the error message
    componentWillMount() {
        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }

        Axios.get('/api/all_questions', header)
        .then(res => this.setState({ questions: res.data }, 
            this.checkIfNoQuestionsFound));
    }

    // handle
    checkIfNoQuestionsFound = () => {
        if (this.state.questions.length === 0) {
            this.setState({ noQuestionsFound : true });
        } else {
            this.setState({ noQuestionsFound : false });
        }
    }

    // handles search bar text change
    onTopicFilterChange = () => {
        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }

        this.setState(
            // sets text filter state to match user input
            { topicFilterText: document.getElementById('topicSearch').value },
            () => {
                // if the search bar is null get all questions
                if (this.state.topicFilterText === "") {

                    Axios.get('/api/all_questions', header)
                    .then(res => this.setState({ questions: res.data }, 
                        this.checkIfNoQuestionsFound));
                } else { // search for questions like the user input
                    // if nothing matches the search display the error message
                    Axios.get('/api/filter/' + this.state.topicFilterText)
                    .then(res => this.setState({ questions : res.data }, 
                        this.checkIfNoQuestionsFound));
                }
            }
        );

    }

    // toggles on/off the "New Question" from
    toggleForm() {
        if (!this.state.isCancelBtn) {
            this.setState({
                isFormHidden: false,
                isCancelBtn: true
            })
        } else {
            this.setState({
                isFormHidden: true,
                isCancelBtn: false
            })
        }
    };

    render() {
        let form = <br/>;
        if (!this.state.isFormHidden) {
            form = <NewQuestionForm toggle={this.toggleForm}/>;
        }

        let btn = this.newQuestionButton;
        if (this.state.isCancelBtn) {
            btn = this.cancelButton
        }

        let questionItems = [];
        for (let i = 0; i < this.state.questions.length; i++) {
            let currQuestion = this.state.questions[i]; 
            // key is "question_entity_id" in ItemBank Model
            questionItems.push(<QuestionItem key={currQuestion.key} id={currQuestion.key} topics={currQuestion.topics} 
                desc={currQuestion.questionText} imgLink={currQuestion.imageLink}/>);
        }

        let noQuestionsErrorMsg = document.getElementById('noQuestionsMsg');
        if (noQuestionsErrorMsg !== null) {
            if (this.state.noQuestionsFound) {
                noQuestionsErrorMsg.classList.remove('d-none');
            } else {
                noQuestionsErrorMsg.classList.add('d-none');
            }
        }

        return(
            <div>
                <Header title="Make and View Questions"/>
                <main>
                    <Nav path={this.props.location.pathname}/>
                    <div className="container">
                        <div className="d-flex flex-row">
                            <h2>Questions</h2>
                            <div className="form-inline ml-auto flex-item">
                                <input id="topicSearch" onChange={this.onTopicFilterChange} className="form-control" type="text" placeholder="Search By Topic" aria-label="Search"/>
                                <button className="btn ml-2 btn-primary">Search</button>
                            </div>
                        </div>
                        {btn}
                        {form}
                        <p id="successMsg" className="text-success d-none">Question added successfully! Reload the page to view/search for your question.</p>
                        <p id="errorMsg" className="text-danger d-none">Question not added</p>
                        <p id="noQuestionsMsg" className="text-secondary text-center d-none">No questions found. Search for a different topic or add a new question.</p>
                        <div id="question-list" className="card-deck d-flex mt-3 flex-row flex-wrap">
                            {questionItems}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(QuestionRepo);