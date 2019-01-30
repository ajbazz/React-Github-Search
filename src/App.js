import React, {Component} from 'react';
import SearchBox from './components/SearchBox';
import {Row, Col} from 'react-bootstrap';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App container">
                <Row>
                    <Col md={2}></Col>
                    <Col md={8} className="header">
                        <div className="page-header text-center">
                            <h4>React GitHub Repo Search</h4>
                            <h6>Enter a search topic and choose a programming language to find relevant
                                GitHub respositories.
                            </h6>
                        </div>
                    </Col>
                </Row>
                <SearchBox/>
            </div>

        )
    }
}

export default App;
