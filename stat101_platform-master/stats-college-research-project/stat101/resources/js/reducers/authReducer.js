import { SIGN_IN, SIGN_OUT, CHECK_LOCAL_AUTH } from '../actions/types';

const initialState = {
    isAuthenticated: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : "",
    userType: localStorage.getItem('userType') ? localStorage.getItem('userType') : "",
    name: localStorage.getItem('name') ? localStorage.getItem('name') : "",
    user_id: localStorage.getItem('user_id') ? localStorage.getItem('user_id') : ""
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SIGN_IN:
            state = action.payload;
            return {
                ...state
            }
        case SIGN_OUT:
            state = action.payload;
            return {
                ...state
            }
        default:
            return state;
    }
}