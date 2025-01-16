import React, { Component } from 'react';
import Option from './Option';

export default class OptionSelect extends Component {
    render() {
        const { choices, onOptionChange, savingAnswer, defaultAnswer } = this.props;

        const optionElements = [];
        for (let i = 0; i < choices.length; i++) {
            const currOption = choices[i];
            let shouldBeChecked = false;
            if (defaultAnswer === currOption.label) {
                shouldBeChecked = true;
            }
            optionElements.push(<Option shouldBeChecked={shouldBeChecked} shouldDisable={savingAnswer} onThisOptionChange={onOptionChange} key={currOption.label} id={currOption.label} text={currOption.text}/>);
        }

        return (
            <div>
                { optionElements }
            </div>
        )
    }
}
