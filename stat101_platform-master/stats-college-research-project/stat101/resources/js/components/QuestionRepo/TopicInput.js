import React, { Component } from 'react'

export default class TopicInput extends Component {
    render() {
        const {id, onTopicChange, value, onDeleteBtnClick} = this.props;

        const btn = typeof onDeleteBtnClick === 'undefined' ? "" : 
            <button name={id} id={id} className="btn btn-danger btn-sm" onClick={(e) => onDeleteBtnClick(e)}>remove</button>;

        return (
            <div>
                <input value={value} onChange={() => onTopicChange(id, document.getElementById('questionTopic' + id).value)} name="questionTopic" className="form-control mt-2 mb-2" type="text" id={"questionTopic" + id} aria-describedby="question topic" placeholder="Ex: Normal Curves"/>
                {btn}
            </div>
        )
    }
}
