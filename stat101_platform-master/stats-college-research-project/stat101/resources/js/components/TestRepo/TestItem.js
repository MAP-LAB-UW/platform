import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { connect } from 'react-redux';

class TestItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            published: "draft",
            publishStartDate: new Date(),
            publishEndDate: new Date(),
            errorMsg: ""
        }
        this.header = {
            headers: {
                Authorization: "Bearer " + this.props.auth.token    
            }
        };
    }

    // updates state to match DateTime pickers
    onStartDateChange = (publishStartDate) => {
        console.log(publishStartDate);
        this.setState({ publishStartDate: publishStartDate });
    }
    onEndDateChange = publishEndDate => this.setState({ publishEndDate: publishEndDate });

    componentWillMount() {
        const {id} = this.props;

        axios.get('/api/tests/published/' + id).then((res) => {
            const status = res.data;
            if (status === "draft") {
                this.setState({ published: "draft" });
            } else if(status === "published") {
                this.setState({ published: "published" });
            }
        })
        .catch((err) => console.log(err));
    }

    // show date form when publish button is pressed
    publish = () => {
        this.setState({ published: "inProgress" }, () => {
            $('#dateform' + this.props.id).removeClass('d-none');
        });
    }

    // cancel publish in progress
    cancelPublish = () => {
        this.setState({ published: "draft" }, () => {
            $('#dateform' + this.props.id).addClass('d-none');
        });
    }

    // Revert test to draft mode
    unpublish = () => {
        const {id} = this.props;

        const opts = {

        };

        axios.post('/api/tests/unpublish/' + id, opts, this.header)
            .then(location.reload())
            .catch(err => this.setState({ errorMsg: err }));
    }

    // finalize the test dates
    submit = (e) => {
        e.preventDefault();
        const {id} = this.props;
        const {publishStartDate, publishEndDate} = this.state;

        const opts = {
            startTime: publishStartDate.toString(),
            endTime: publishEndDate.toString()
        };

        axios.post('/api/tests/publish/' + id, opts, this.header).then((res) => {
            location.reload();
        }).catch(err => this.setState({errorMsg: err}));
    }

    render() {
        const {publishStartDate, publishEndDate, published} = this.state;
        const {testName, topics, date, id} = this.props;

        // show publish/edit or end/monitor buttons
        let publishBtn = "";
        let editMonitorBtn = "";
        if (published === "draft") {
            publishBtn = <button onClick={this.publish} className="btn btn-primary ml-3">Publish</button>;
            editMonitorBtn = (<Link to={'/teacher-tests/edit-test/' + id}>
                <button className="btn btn-primary">Edit</button>
            </Link>);
        } else if (published === "published") {
            publishBtn = <button onClick={this.unpublish} className="btn btn-danger ml-3">End Test</button>;
            editMonitorBtn = (<Link to={'/monitor/' + id}>
                <button className="btn btn-primary">Show Progress</button>
            </Link>);
        } else { // "inProgress"
            publishBtn = <button onClick={this.cancelPublish} className="btn btn-danger ml-3">Cancel</button>;
            editMonitorBtn = (<Link to={'/monitor/' + id}>
                <button className="btn btn-primary">Edit</button>
            </Link>);
        }

        let topicsHeader = topics[0];
        for (let i = 1; i < topics.length; i++) {
            topicsHeader += ", " + topics[i];
        }

        return (
            <div className="card mt-2">
                <div className="card-body">
                    <h4 className="mb-2">{testName}</h4>
                    <h5 className="mb-2 card-subtitle">{topicsHeader}</h5>
                    <h6 className="mb-2 card-subtitle text-muted">{date}</h6>
                    <div className="d-flex flex-row">
                        {editMonitorBtn}
                        {publishBtn}
                    </div>
                    <div id={"dateform" + id} className="mt-3 d-none">
                        <div className="d-flex flex-column">
                            <div>
                                <h5>Start Time</h5>
                                <DateTimePicker id="startDate" onChange={this.onStartDateChange} value={publishStartDate}/>
                            </div>
                            <div className="mt-3">
                                <h5>End Time</h5>
                                <DateTimePicker id="endDate" onChange={this.onEndDateChange} value={publishEndDate}/>
                            </div>
                            <button onClick={this.submit} className="btn btn-primary mt-2 w-25">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

export default  connect(mapStateToProps, {})(withRouter(TestItem));
