import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import MathJax from 'react-mathjax-preview';

export default class QuestionItem extends Component {

    render() {
        const {id, topics, desc, imgLink} = this.props;

        // format topics to text
        let topicsText = topics[0];
        if (topics.length > 1) {
            for (let i = 1; i < topics.length; i++) {
                topicsText += ", " + topics[i];
            }
        }

        const img = imgLink == null ? "" : 
            (
                <div>
                    <h5>Image:</h5>
                    <img src={"/storage/" + imgLink}/>  
                </div>
            );
            

        return (
            <div className="card mt-2">
                <div data-tip data-for={'tooltip' + id} className="card-body">
                    <h5 className="mb-2" style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}>{topicsText}</h5>
                    <p className="card-text">{desc}</p>
                </div>
                <Link className="w-100" to={"edit-question/" + id}>
                    <button className="btn btn-primary w-100">
                        Edit
                    </button>
                </Link>
                <ReactTooltip place="bottom" id={'tooltip' + id} type="light" effect="float">
                        <h5 className="mb-2">Topics</h5>
                        <p>{topicsText}</p>
                        <h5>Text</h5>
                        <div style={{width: "300px"}}>
                            <MathJax math={desc}/>
                        </div>
                        {img}
                </ReactTooltip>
            </div>
        )
    }
}
