import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {Languages} from './Languages';
import Repos from './Repos';

class SearchBox extends Component {
    constructor() {
        super();
        this.state = {
            topic: '',
            language: '',
            getNewData: false
        }
        this.searchParams = [];
        this.langRef = React.createRef();
    }

    componentDidMount() {
        const selectEl = this.langRef.current;
        for (let i = 0; i < Languages.length; i++) {
            selectEl.add(new Option(Languages[i], Languages[i]))
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        if (event.target.name === "topic") {
            this.searchParams[0] = event.target.value;
        } else {
            this.searchParams[1] = event.target.value;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({getNewData: true, topic: this.searchParams[0], language: this.searchParams[1]});
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md={2}></Col>
                    <Col md={10} className="searchBox">
                        <Row>
                            <Col md={10}>
                                <form
                                    onSubmit={this.handleSubmit}>
                                    <div className="form-row align-items-center">
                                        <Col md={5} ml={3}>
                                            <input
                                                autoFocus
                                                required
                                                className="form-control mr-2"
                                                name="topic"
                                                onChange={this.handleChange}
                                                value={this.topic}
                                                placeholder="e.g. twitter, chess, aws"/>
                                        </Col>
                                        <Col md={5} pr={0}>
                                            <select
                                                required
                                                className="form-control mr-2"
                                                ref={this.langRef}
                                                name="language"
                                                defaultValue={this.language}
                                                onChange={this.handleChange}>
                                                <option value="">Choose a language</option>
                                            </select>
                                        </Col>
                                        <Col md={1}>
                                            <span className="input-group-btn">
                                                <button
                                                    className="btn btn-default btn-lg btn-hover btn-primary"
                                                    type="submit">Search</button>
                                            </span>
                                        </Col>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}></Col>
                    <Col md={10}>
                        <Row>
                            <Col md={10} className="pl-0">
                                {this.state.getNewData
                                    ? <Repos topic={this.state.topic} language={this.state.language}/>
                                    : null}
                            </Col>
                            <Col md={2}></Col>

                        </Row>
                    </Col>
                </Row>
            </div>

        )
    }
}

export default SearchBox;