import React, { Component } from 'react';
import MathJax from 'react-mathjax-preview';

// represents one option input
export default class OptionInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choiceText: this.props.value
        }
    }

    render() {
        const {id, onOptionChange, value, removeChoice} = this.props;

        const btn = typeof removeChoice === 'undefined' ? "" :
            <button onClick={removeChoice} name={id} className="btn btn-danger btn-sm mt-2">remove</button>

        return (
            <div className="form-group">
                <label htmlFor={"choice" + id}>{id}</label>
                <input onChange={(e) => {
                    this.setState({ choiceText: e.target.value });
                    onOptionChange(id, e.target.value);
                }} value={value} className="form-control" type="text" id={"choice" + id} aria-describedby={"choice" + id} placeholder="type the answer choice text here"></input>
                <div>
                    <MathJax math={this.state.choiceText}/>
                </div>
                {btn}
            </div>
        )
    }
}
