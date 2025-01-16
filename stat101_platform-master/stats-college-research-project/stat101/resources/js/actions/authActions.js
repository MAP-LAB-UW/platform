import { SIGN_IN, SIGN_OUT } from './types';

export const signin = (name, user_id, token, userType) => dispatch => {
    dispatch({
        type: SIGN_IN,
        payload: {
            name: name,
            user_id: user_id,
            isAuthenticated: token ? true : false,
            token: token,
            userType: userType
        }
    });
}

export const signout = () => dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('userType');
    dispatch({
        type: SIGN_OUT,
        payload: {
            name: "",
            user_id: "",
            isAuthenticated: false,
            userType: "",
            token: ""
        }
    });
}