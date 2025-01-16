import React, { Component } from 'react';
import Header from '../Header';
import Nav from '../Nav';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import OptionInput from '../QuestionRepo/OptionInput';
import TopicInput from '../QuestionRepo/TopicInput';
import { connect } from 'react-redux';
import MathJax from 'react-mathjax-preview';

const LOWER_CASE_A = 97;

// url parameters can be accessed from "this.props.match.params"
class EditQuestion extends Component {
    constructor() {
        super();
        this.state = {
            questionTopics: [],
            questionBodyText: "",
            choices: [],
            correctAnswer: "A",
            topicInputCount: 1,
            currChoiceLabel: 'b',
            file: null
        };
        this.onOptionInputChange = this.onOptionInputChange.bind(this);
        this.onTopicInputChange = this.onTopicInputChange.bind(this);
        this.onRemoveTopic = this.onRemoveTopic.bind(this);
        this.onRemoveChoice = this.onRemoveChoice.bind(this);
    }
        
    // function to be called when either topic or question body changes
    // changes the appropriate state to match user's input
    // state: name of state field to change
    // value: the value to reassign the field
    onTextChange = (state, value) => {
        this.setState({ [state] : value });
    }

    // called when user clicks "remove" button on an answer choice
    // updates state to reflect change
    onRemoveChoice(e) {
        e.preventDefault();
        const choice = $('#choice' + e.target.name).val();
        // debugger;
        let newArr = [...this.state.choices];
        // get rid of removed choice
        newArr = newArr.filter((currChoice) => currChoice.text !== choice);
        newArr = newArr.map((choice, index) => {
            return {
                key: String.fromCharCode(LOWER_CASE_A + index),
                text: choice.text
            }
        });
        const newChoiceLabel = String.fromCharCode(this.state.currChoiceLabel.charCodeAt(0) - 1);
        this.setState({ choices: newArr, currChoiceLabel: newChoiceLabel });
    }

    // called when user clicks "remove" button on a topic
    // updates state to reflect change
    onRemoveTopic = (e) => {
        e.preventDefault();
        const topic = $('#questionTopic' + e.target.name).val();
        let newArr = [...this.state.questionTopics];
        newArr = newArr.filter((currTopic) => topic !== currTopic);
        this.setState({ questionTopics: newArr });
    }

    // updates state to match option input values
    onTopicInputChange(key, value) {
        const {questionTopics} = this.state;

        const newArr = [...questionTopics];
        newArr[key] = value;

        this.setState({ questionTopics: newArr });
    }

    // updates the state to match the selected correct answer
    onCorrectAnswerChange = () => {
        const correctAnswer = document.getElementById('correctAnswer').value;
        this.setState({ correctAnswer: correctAnswer });
    }

    // called when user changes an option
    // updates choices state array
    // label: index in choices array
    onOptionInputChange(label, text) {
        const {choices} = this.state;

        const get = (label) => {
            for (let i = 0; i < choices.length; i++) {
                if (choices[i].key === label) {
                    return i;
                }
            }
        }

        const newArr = [...choices]; // copy choices array

        newArr[get(label)].text = text;

        this.setState({ choices: newArr });
    }

    // adds a new option input to the form
    onAddOptionInput = (e) => {
        e.preventDefault();
        
        const {choices, currChoiceLabel} = this.state;

        const newChoices = [...choices];

        const newChoiceLabel = currChoiceLabel.charCodeAt(0) === 122 ?
            'A' :
            String.fromCharCode(currChoiceLabel.charCodeAt(0) + 1);

        this.setState({ currChoiceLabel: newChoiceLabel }, () => {
            newChoices.push({
                key: this.state.currChoiceLabel, // need this.state otherwise old label will be referenced
                text: ""}
            );
            this.setState({ choices: newChoices });
        });

        

    }

    // adds a new topic input
    addTopic = (e) => {
        e.preventDefault();

        const {questionTopics, topicInputCount} = this.state;
        let count = topicInputCount;
        const newArr = [...questionTopics];
        newArr.push("");

        this.setState({ topicInputCount: count + 1, questionTopics: newArr });
    }

    // get question data
    componentWillMount() {
        Axios.get('/api/question/' + this.props.match.params.item_id)
            .then((res) => {
                let data = res.data;
                const choicesArr = Object.entries(data.choices);
                let choices = [];
                for (let i = 0; i < choicesArr.length; i++) {
                    choices.push({key: choicesArr[i][0], text: choicesArr[i][1]});
                }

                const newChoiceLabel = String.fromCharCode(LOWER_CASE_A + choices.length - 1);

                this.setState({
                    questionTopics: data.topics,
                    questionBodyText: data.questionBody,
                    choices: choices,
                    correctAnswer: data.correct_answer,
                    currChoiceLabel: newChoiceLabel
                });
            });
    }

    // handles submission of the form
    onSubmit = (e) => {
        e.preventDefault();

        const {questionBodyText, correctAnswer, questionTopics, choices, file} = this.state;

        // POST body
        // const opts = {
        //     questionBody: questionBodyText,
        //     correctAnswer: correctAnswer,
        //     topics: questionTopics,
        //     choices: choices
        // };

        const formData = new FormData();
        formData.append('questionBody', questionBodyText);
        formData.append('correctAnswer', correctAnswer);
        formData.append('topics', JSON.stringify(questionTopics));
        formData.append('choices', JSON.stringify(choices));
        formData.append('image', file);

        console.log(formData);

        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }

        // store the data in the database and display the appropriate response
        axios.post('/api/question/update/' + this.props.match.params.item_id, formData, header).then((res) => {
            // console.log(res);
            document.getElementById('successMsg').classList.remove('d-none');
        })
        .catch((err) => {
            document.getElementById('errorMsg').classList.remove('d-none');
        });
        document.getElementById('form').classList.add('d-none');
    }

    // updates every time the file input changes
    onFileInputChage = event => {
        this.setState({ file: event.target.files[0] });
    }

    render() {
        const {questionBodyText, questionTopics, choices, correctAnswer, imageLink} = this.state;

        let optionComponents = [];
        for (let i = 0; i < choices.length; i++) {
            optionComponents.push(<OptionInput removeChoice={this.onRemoveChoice} key={choices[i].key} id={choices[i].key} value={choices[i].text} onOptionChange={this.onOptionInputChange}/>);
        }

        let topicComponents = [];
        for (let i = 0; i < questionTopics.length; i++) {
            topicComponents.push(<TopicInput onDeleteBtnClick={this.onRemoveTopic} id={i} key={i} onTopicChange={this.onTopicInputChange} value={questionTopics[i]}/>);
        }

        // render correct answer dropdown options
        const dropdownOptions = [];
        for (let i = 0; i < choices.length; i++) {
            dropdownOptions.push(<option key={i}>{choices[i].key}</option>)
        }

        return (
            <div>
                <Header title="Edit"/>
                <main>
                    <Nav/>
                    <Link to='/teacher-question-repo'>
                        <p id="successMsg" className="text-success text-center d-none">Your changes have been saved! Click here to go back to Create/Edit Questions.</p>
                        <p id="errorMsg" className="text-secondary text-center d-none">Your changes were not saved. Try again later. Click here to go back to Create/Edit Questions.</p>
                    </Link>
                    <form id="form" className="container">
                        <div className="form-group d-flex flex-column">
                            <label htmlFor="questionTopic">Topics</label>
                            {topicComponents}
                        </div>
                        <div className="form-group">
                            <button onClick={this.addTopic} className="btn btn-primary">Add Topic</button>
                        </div>
                        <div className="form-group">
                            <textarea onChange={() => {
                                let questionBody = document.getElementById('questionBodyText').value;
                                this.onTextChange("questionBodyText", questionBody);
                            }} name="questionBodyText" value={questionBodyText} className="form-control" id="questionBodyText" rows="4" placeholder="type your question here"></textarea>
                        </div>
                        <div className="form-group">
                        <h5>Preview:</h5>
                            <div className="bg-white">
                                <MathJax math={this.state.questionBodyText}/>
                            </div>
                        </div>
                        <div className="form-group d-flex flex-column">
                            <label htmlFor="fileInput">Attach an Image</label>
                            <small className="text-secondary">Don't select a file if you don't want to change the current image</small>
                            <input type="file" name="fileInput" onChange={this.onFileInputChage}/>
                        </div>
                        <h3>Answer Choices</h3>
                        {optionComponents}
                        <div className="form-group">
                            <button onClick={this.onAddOptionInput} className="btn btn-primary">Add Another Option</button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correctAnswer">Correct Answer:</label>
                            <select value={correctAnswer} onChange={this.onCorrectAnswerChange} className="form-control" id="correctAnswer">
                                {dropdownOptions}
                            </select>
                        </div>
                        <button onClick={this.onSubmit} className="btn btn-primary mt-1">Submit</button>
                    </form>
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(EditQuestion);
