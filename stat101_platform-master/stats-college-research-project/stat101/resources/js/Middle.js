import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Index from './Index';
import store from './store';

export default class Middle extends Component {
    render() {
        return (
            <Provider store={store}>
                <Index/>
            </Provider>
        )
    }
}

if (document.getElementById('index')) {
    ReactDOM.render(<Middle/>, document.getElementById('index'));
}
