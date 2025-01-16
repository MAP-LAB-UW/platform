import React, { Component } from 'react';

export default class TopicInput extends Component {
    render() {
        const { changeThisTopic, count, value, remove } = this.props;

        return (
            <div className="d-flex flex-column">
                <input value={value} onChange={() => changeThisTopic(count, $('#testTopic' + count).val())} name={"testTopic" + count} className="form-control mt-2" type="text" id={"testTopic" + count} aria-describedby="test topic" placeholder="Ex: Normal Curves"/>
                <button onClick={(e) => remove(e, value)} className="btn btn-danger btn-sm mt-1" style={{width: "5rem"}} >Remove</button>
            </div>
            
        )
    }
}
