import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import MathJax from 'react-mathjax-preview';

export default class QuestionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        }
    }

    componentWillMount() {
        this.setState({ clicked : this.props.clicked });
    }

    // adds question_entity_id to parent state
    onAddBtnClick = (e) => {
        e.preventDefault();
        this.setState({ clicked : !this.state.clicked });
        this.props.onAddQuestionBtnClick(this.props.id);
    }

    // removes question_entity_id from parent state
    onRemoveBtnClick = (e) => {
        e.preventDefault();
        this.setState({ clicked : !this.state.clicked });
        this.props.onRemoveBtnClick(this.props.id);
    }

    render() {
        // determines which button to show
        let btn = (<button onClick={this.onAddBtnClick} className="btn btn-primary w-100">
            Add
        </button>)
        if (this.state.clicked) {
            btn = (<button onClick={this.onRemoveBtnClick} className="btn btn-danger w-100">
            Remove
        </button>)
        }

        const {id, topics, desc} = this.props;

        // format topics
        let topicsText = topics[0];
        if (topics.length > 1) {
            for (let i = 1; i < topics.length; i++) {
                topicsText += ", " + topics[i];
            }
        }

        return (
            <div data-tip data-for={'tooltip' + id} className="card mt-2">
                <div className="card-body">
                    <h5 className="mb-2">{topicsText}</h5>
                    <p className="card-text">{desc}</p>
                </div>
                {btn}
                <ReactTooltip place="bottom" id={'tooltip' + id} type="light" effect="float">
                        <h5 className="mb-2">Topics</h5>
                        <p style={{textOverflow: "ellipsis"}}>{topicsText}</p>
                        <h5>Text</h5>
                        <div style={{width: "300px"}}>
                            <MathJax math={desc}/>
                        </div>
                </ReactTooltip>
            </div>
            
        )
    }
}