import React, { Component } from 'react';

export default class TableRow extends Component {
    render() {
        const { correct, incorrect, name } = this.props;

        const formattedScore = parseInt(correct) + parseInt(incorrect);

        return (
            <tr>
                <th scope="row">{name}</th>
                <td className="">{formattedScore}</td>
                <td>{correct}</td>
                <td>{incorrect}</td>
            </tr>
        )
    }
}
