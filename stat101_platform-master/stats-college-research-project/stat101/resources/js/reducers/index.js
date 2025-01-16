import { combineReducers } from 'redux';
import authReducer from './authReducer';
import studentTestReducer from './studentTestReducer';

export default combineReducers({
    auth: authReducer,
    takeTest: studentTestReducer
});
