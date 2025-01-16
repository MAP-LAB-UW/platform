import React, { Component } from 'react';
import { connect } from 'react-redux';
import MathJax from 'react-mathjax-preview';

class Option extends Component {
    render() {
        const { text, id, onThisOptionChange, shouldDisable, shouldBeChecked } = this.props;

        return (
            <div id={"option" + id} className="radio border bg-light mt-3 rounded">
                <input checked={shouldBeChecked} disabled={shouldDisable} className="ml-2" id={id} onChange={onThisOptionChange} value={id} type="radio" name="optradio"/>
                <label className="ml-3" htmlFor={id} >
                    <MathJax math={text}/>
                </label>
                {/* <div style={{ lineHeight: "300%" }} className="d-flex flex-row mb-none">
                    <span className="mb-none">{id + "."}</span>
                    <p className="ml-2 mb-none">{text}</p>
                </div> */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, {})(Option);
