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
        this.langRef = React.createRef();
        this.handleLangChange = this.handleLangChange.bind(this);
        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const selectEl = this.langRef.current;
        for (let i = 0; i < Languages.length; i++) {
            selectEl.add(new Option(Languages[i], Languages[i]))
        }
    }

    handleLangChange = (e) => {
        this.setState({language: e.target.value, getNewData: false})
    }

    handleTopicChange = (e) => {
        this.setState({topic: e.target.value, getNewData: false})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({getNewData: true});
    }

    render() {
        return (
            <div className="searchBox">
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row align-items-center">
                                <Col md={1}></Col>
                                <Col md={5}>
                                    <input
                                        autoFocus
                                        required
                                        className="form-control mr-2"
                                        onChange={this.handleTopicChange}
                                        value={this.state.topic}
                                        placeholder="Search for Repos"/>
                                </Col>
                                <Col md={5}>
                                    <select
                                        required
                                        className="form-control mr-2"
                                        ref={this.langRef}
                                        defaultValue={this.state.language}
                                        onChange={this.handleLangChange}>
                                        <option value="">Choose a language</option>
                                    </select>
                                </Col>
                                <Col md={1}>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default btn-lg btn-hover btn-primary" type="submit">Search</button>
                                    </span>
                                </Col>
                                <Col md={1}></Col>
                            </div>
                        </form>
                    </Col>
                    <Col md={2}></Col>
                </Row>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                      {this.state.getNewData
                        ? <Repos topic={this.state.topic} language={this.state.language} />
                        : null
                      }
                    </Col>
                    <Col md={2}></Col>

                </Row>
            </div>

        )
    }
}

export default SearchBox;