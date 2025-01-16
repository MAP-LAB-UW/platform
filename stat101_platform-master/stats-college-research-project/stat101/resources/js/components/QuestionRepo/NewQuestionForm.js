import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopicInput from './TopicInput';
import OptionInput from './OptionInput';
import { connect } from 'react-redux';
import MathJax from 'react-mathjax-preview';

const LOWER_CASE_A = 97;

class NewQuestionForm extends Component {

    constructor() {
        super();
        this.state = {
            questionTopics: [""],
            questionBodyText: "",
            choices: [{key: "a", text: ""}, {key: "b", text: ""}],
            correctAnswer: "a",
            topicInputCount: 1,
            currChoiceLabel: 'b',
            file: null
        };

        this.onOptionInputChange = this.onOptionInputChange.bind(this);
        this.onTopicInputChange = this.onTopicInputChange.bind(this);
    }

    // function to be called when either topic or question body changes
    // changes the appropriate state to match user's input
    // state: name of state field to change
    // value: the value to reassign the field
    onTextChange = (state, value) => {
        this.setState({ [state] : value });
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
        let correctAnswer = document.getElementById('correctAnswer').value;
        this.setState({ correctAnswer: correctAnswer });
    }

    // handles submission of the New Question form
    onSubmit = (e) => {
        e.preventDefault();

        const {questionBodyText, questionTopics, correctAnswer, choices, file} = this.state;

        // // POST body
        // let opts = {
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
        if (file === null) {
            formData.append('image', "noImage");    
        } else {
            formData.append('image', file);
        }
        
        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        }

        // store the data in the database and display the appropriate response
        axios.post('/api/all_questions', formData, header).then((res) => {
            document.getElementById('successMsg').classList.remove('d-none');
        })
        .catch((err) => {
            document.getElementById('errMsg').classList.remove('d-none');
        });
        this.props.toggle();
    }

    // called when user changes an option
    // updates choices state array
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

    // updates every time the file input changes
    onFileInputChage = event => {
        this.setState({ file: event.target.files[0] });
    }

    render() {
        const { topicInputCount, currChoiceLabel, choices } = this.state;

        // render number of topic inputs equal to the count of topic inputs in 
        // state
        const topicInputArray = [];

        for (let i = 0; i < topicInputCount; i++) {
            topicInputArray.push(<TopicInput onTopicChange={this.onTopicInputChange} id={i} key={i}/>);
        }

        // render number of options according to this state
        const optionInputArray = [];

        for (let i = LOWER_CASE_A; i <= currChoiceLabel.charCodeAt(0); i++) {
            const str = String.fromCharCode(i);
            optionInputArray.push(<OptionInput onOptionChange={this.onOptionInputChange} id={str} key={str}/>);
        }

        // render correct answer dropdown options
        const dropdownOptions = [];

        for (let i = 0; i < choices.length; i++) {
            dropdownOptions.push(<option key={i}>{choices[i].key}</option>)
        }

        return (
            <div className="bg-light container">
                <form encType="multipart/form-data">
                    <div className="form-group d-flex flex-column">
                        <label htmlFor={"questionTopic"}>Topic(s)</label>
                        {topicInputArray}
                    </div>
                    <div className="form-group">
                        <button onClick={this.addTopic} className="btn btn-primary">Add Topic</button>
                    </div>
                    <div className="form-group d-flex flex-column">
                        <label htmlFor="fileInput">attach an image</label>
                        <input type="file" name="fileInput" onChange={this.onFileInputChage}/>
                    </div>
                    <div className="form-group">
                        <textarea onChange={() => {
                            let questionBody = document.getElementById('questionBodyText').value;
                            this.onTextChange("questionBodyText", questionBody);
                        }} name="questionBodyText" className="form-control" id="questionBodyText" rows="4" placeholder="type your question here"></textarea>
                        <small>
                            To type LaTek expressions, wrap the expression in a dollar sign. If you would like to start the expression on a new line, 
                            wrap the expression in double dollar signs. <a target="_blank" href="https://www.mathjax.org/#demo">Click here for more information.</a>
                        </small>
                    </div>
                    <div className="form-group">
                        <h5>Preview:</h5>
                        <div className="bg-white">
                            <MathJax math={this.state.questionBodyText}/>
                        </div>
                    </div>
                    <h3>Answer Choices</h3>
                    {optionInputArray}
                    <div className="form-group">
                        <button onClick={this.onAddOptionInput} className="btn btn-primary">Add Another Option</button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sel1">Correct Answer:</label>
                        <select onChange={this.onCorrectAnswerChange} className="form-control" id="correctAnswer">
                            {dropdownOptions}
                        </select>
                    </div>
                    <Link to='/teacher-question-repo'>
                        <button onClick={this.onSubmit} className="btn btn-primary mt-1">Submit</button>
                    </Link>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(NewQuestionForm);
