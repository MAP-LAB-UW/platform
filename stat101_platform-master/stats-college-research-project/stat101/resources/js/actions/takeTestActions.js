import { START_TEST, FETCHING, RESUME_TEST, CHANGE_ANSWER_CHOICE, CHANGE_CURR_QUESTION } from './types';
import axios from 'axios';

// tell the backend to start the test and get question and test info data back
export const startTest = (auth, testId, studentId, fromStudentHome) => dispatch => {
    dispatch(fetching({}));
    axios.post('/api/start-test', {
        studentId: studentId,
        testId: testId
    }, auth)
    .then((res) => {
        let data = res.data;
        const testInfo = data.testInfo;
        delete data.testInfo;
        const dataToArray = [];
        for (let key in data) {
            dataToArray.push(data[key]);
        }
        dispatch({
            type: START_TEST,
            payload: {
                questions: dataToArray,
                currQuestion: dataToArray[0],
                testInfo: testInfo,
                fetching: false,
                fetched: true,
                fromStudentHome: fromStudentHome
            }
        });
    });
}

// get data to resume a test
export const resumeTest = (auth, testId, studentId, fromStudentHome) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch(fetching({}));
        axios.post('/api/resume-test', {
            studentId: studentId,
            testId: testId
        }, auth)
        .then((res) => {
            let data = res.data;
            const testInfo = data.testInfo;
            delete data.testInfo;
            const dataToArray = [];
            for (let key in data) {
                dataToArray.push(data[key]);
            }
            dispatch({
                type: RESUME_TEST,
                payload: {
                    questions: dataToArray,
                    currQuestion: dataToArray[0],
                    testInfo: testInfo,
                    fetching: false,
                    fetched: true,
                    fromStudentHome: fromStudentHome
                }
            });
            resolve();
        });
    });
}

// change questions
// nextQuestionNumber -> question number to switch to
// testData -> previous state
export const changeCurrQuestion = (nextQuestionNumber, testData) => {
    testData.currQuestion = testData.questions[nextQuestionNumber - 1];
    return {
        type: CHANGE_CURR_QUESTION,
        payload: testData
    };
}

// change an option on a question
export const changeAnswerChoice = (answer, testData, questionNumber) => {
    // return new Promise((resolve, reject) => {
    //     dispatch(fetching(testData));
    //     axios.post('/api/save-answer/', opts, header).then((res) => {
    //         const changedQuestion = testData.questions[questionNumber - 1];
    //         changedQuestion.savedAnswer = opts.answer;
    //         dispatch({
    //             type: CHANGE_ANSWER_CHOICE,
    //             payload: {
    //                 testData
    //             }
    //         });
    //         resolve(changedQuestion.savedAnswer);
    //     })
    // });
    const changedQuestion = testData.questions[questionNumber - 1];
    changedQuestion.savedAnswer = answer;
    testData.currQuestion = changedQuestion;
    return {
        type: CHANGE_ANSWER_CHOICE,
        payload: testData
    }
}

// signal that data is being fetched asynchronously
export const fetching = (currData) => {
    currData.fetching = true;
    return { 
        type: FETCHING, 
        payload: {
            currData
        } 
    }
}