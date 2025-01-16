import { START_TEST, RESUME_TEST, FETCHING, CHANGE_ANSWER_CHOICE, CHANGE_CURR_QUESTION } from '../actions/types';

const initialState = {
    questions: [], // array[objects] where each object has key orderNumber(num), questionEntityId(num), isComplete(boolean)
    testInfo: {}, // object with fields "testInstanceId" and "testBankId"
    fetching: false,
    fetched: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCHING: 
            state = action.payload;
            return {
                ...state
            }
        case START_TEST:
            state = action.payload;
            return {
                ...state
            }
        case RESUME_TEST:
            state = action.payload;
            return {
                ...state
            }
        case CHANGE_ANSWER_CHOICE:
            state = action.payload;
            return {
                ...state
            }
        case CHANGE_CURR_QUESTION:
            state = action.payload;
            return {
                ...state
            }
        default:
            return state;
    }
}