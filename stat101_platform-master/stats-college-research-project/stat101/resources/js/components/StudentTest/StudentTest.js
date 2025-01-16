import React, { Component } from 'react';
import Header from '../Header';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { connect } from 'react-redux';
import OptionSelect from './OptionSelect';
import { resumeTest, changeAnswerChoice, changeCurrQuestion } from '../../actions/takeTestActions';
import Axios from 'axios';
import Loading from '../Loading';
import MathJax from 'react-mathjax-preview';

class StudentTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // if the page is loading
            selectedOpt: "", // current option selected
            savingAnswer: false, // if a new answer is being recorded
            started: false, // if the current question has already been started
            switchedQuestions: false // if the user changed to a new question
        }
        this.onOptionChange = this.onOptionChange.bind(this);
    }

    // get test data and check the initial question
    componentWillMount() {

        const { takeTest, resumeTest } = this.props;

        if (!takeTest.fetched) {
            this.setState({ loading: true }, () => {
                const { token, user_id } = this.props.auth;
                const { testInstance } = this.props.match.params;

                // POST header
                const header = {
                    headers: {
                        Authorization: "Bearer " + token    
                    }
                }

                resumeTest(header, testInstance, user_id, false).then(() => {
                    const { currQuestion } = this.props.takeTest;

                    const opts = {
                        itemInstanceId: currQuestion.itemInstanceId
                    }
                    
                    Axios.post('/api/start-question', opts, header).then(() => {
                        this.setState({ loading: false, started: true, switchedQuestions: true }, () => {
                            const { savedAnswer } = currQuestion;
                            if (savedAnswer != false) {
                                $('#' + savedAnswer).prop("checked", true);
                            } else {
                                $('input').prop("checked", false);
                            }
                        });
                    });
                });
            })
        }
    }

    componentDidUpdate() {
        if (this.props.takeTest.fetched) {
            const { switchedQuestions } = this.state; 
            // console.log(this.props.takeTest);   
            const { savedAnswer } = this.props.takeTest.currQuestion;

            if (switchedQuestions) {
                if (savedAnswer != false) {
                    $('#' + savedAnswer).prop("checked", true);
                } else {
                    $('input').prop("checked", false);
                }
                this.setState({ switchedQuestions: false });
            }
        }
    }

    // called when user changes the answer choice
    onOptionChange() {
        this.setState({ savingAnswer: true }, () => {
            const { changeAnswerChoice, takeTest } = this.props;
            const selectedOpt = $('input:checked').val();
            const { questionNumber } = this.props.match.params;
            const { currQuestion } = this.props.takeTest;
            const itemInstanceId = currQuestion.itemInstanceId;
            const opts = {
                answer: selectedOpt,
                itemInstanceId: itemInstanceId,
            }

            // POST header
            const { token } = this.props.auth;
            const header = {
                headers: {
                    Authorization: "Bearer " + token    
                }
            }
            
            axios.post('/api/save-answer/', opts, header).then(() => {
                this.setState({ savingAnswer: false, selectedOpt: selectedOpt }, () => {
                    changeAnswerChoice(selectedOpt, takeTest, questionNumber);
                });
            });
        })
        
    }

    // called when the user changes the value on the dropdown
    onSelectChange = nextQuestionNumber => {
        const { token } = this.props.auth;
        const { takeTest, changeCurrQuestion } = this.props;

        // POST header
        const header = {
            headers: {
                Authorization: "Bearer " + token    
            }
        }

        changeCurrQuestion(nextQuestionNumber.value, takeTest);

        const { currQuestion } = this.props.takeTest;
        
        const opts = {
            itemInstanceId: currQuestion.itemInstanceId
        }

        Axios.post('/api/start-question', opts, header).then(() => {
            this.setState({ started: true, switchedQuestions: true }, () => {
                const { testInstance} = this.props.match.params;
                this.props.history.push(`/student-test/${testInstance}/${nextQuestionNumber.value}`);
            });
        });
    }

    // go to the next page when next button is clicked
    onNextBtnClick = () => {
        const nextQuestionNumber = parseInt(this.props.takeTest.currQuestion.questionNumber) + 1;
        this.onSelectChange({ value: nextQuestionNumber });
    }

    // go to the previous problem when next button is clicked
    onPrevBtnClick = () => {
        const nextQuestionNumber = parseInt(this.props.takeTest.currQuestion.questionNumber) - 1;
        this.onSelectChange({ value: nextQuestionNumber });
    }

    // go back to student home
    onSubmitBtnClick = () => {
        this.props.history.push('/student-home');
    }

    render() {
        // debugger;
        const { loading, savingAnswer } = this.state;

        if (loading) {
            return (
                <Loading/>
            );
        }

        const { questionNumber } = this.props.match.params;
        const { questions } = this.props.takeTest;
        const { currQuestion, fromStudentHome } = this.props.takeTest;

        const options = [
            // { value: 'one', label: 'One' },
            // { value: 'two', label: 'Two', className: 'myOptionClassName' },
            // {
            //  type: 'group', name: 'group1', items: [
            //    { value: 'three', label: 'Three', className: 'myOptionClassName' },
            //    { value: 'four', label: 'Four' }
            //  ]
            // },
            // {
            //  type: 'group', name: 'group2', items: [
            //    { value: 'five', label: 'Five' },
            //    { value: 'six', label: 'Six' }
            //  ]
            // }
        ];      
        
        for (let i = 0; i < questions.length; i++) {
            const label = questions[i].questionNumber;
            options.push({
                value: label, label: label
            });
        }

        // const optionElements = [];
        // for (let i = 0; i < currQuestion.choices.length; i++) {
        //     const currOption = currQuestion.choices[i];
        //     // const shouldBeChecked = savedAnswer == currOption.label ? true : false;
        //     optionElements.push(<Option shouldDisable={savingAnswer} onThisOptionChange={this.onOptionChange} key={currOption.label} id={currOption.label} text={currOption.text}/>);
        // }

        const visibleOrNot = savingAnswer ? "visible" : "invisible";

        let img = "";
        if (currQuestion.imgLink !== null) {
            img = <img src={'/storage/' + currQuestion.imgLink}/>
        }

        return (
            <div>
                <Header title={this.props.takeTest.testInfo.testName}/>
                <main>
                    <div className="container">
                        <div id="studentTest">
                            <div className="container ">
                                <h5>Question Number</h5>
                                <Dropdown value={questionNumber} onChange={this.onSelectChange} options={options} className="questionDropdown"/>
                            </div>
                            <div className="container mt-4">
                                <MathJax math={currQuestion.questionBody}/>
                                <div className="text-center">
                                    {img}
                                </div>
                                <OptionSelect defaultAnswer={currQuestion.savedAnswer} savedAnswer={savingAnswer} choices={currQuestion.choices} onOptionChange={this.onOptionChange}/>
                                <div id="savingMsg" className={visibleOrNot}>
                                    <p className="text-secondary">Saving...</p>
                                </div>
                                <div className="">
                                    {questionNumber != questions.length ? 
                                    <button onClick={this.onNextBtnClick} className="btn btn-primary ml-auto mr-auto mb-5 float-right">Next</button> : 
                                    <button onClick={this.onSubmitBtnClick} className="btn btn-lg btn-primary ml-auto mr-auto mb-5 float-right">Submit</button>}
                                    {questionNumber != 1 ? 
                                    <button onClick={this.onPrevBtnClick} className="btn btn-primary ml-auto mr-auto mb-5 float-left">Previous</button> : 
                                    ""}
                                </div>
                            </div>

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

export default connect(mapStateToProps, { resumeTest, changeAnswerChoice, changeCurrQuestion })(StudentTest);
