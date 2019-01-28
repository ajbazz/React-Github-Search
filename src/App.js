import React, {Component} from 'react';
import SearchBox from './components/SearchBox';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App container">
                <div className="header">
                    <div className="page-header text-center">
                        <h4>React GitHub Repo Search</h4>
                    </div>
                </div>
                <div>
                    <SearchBox/>
                </div>
            </div>

        )
    }
}

export default App;
