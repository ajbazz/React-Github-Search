import React, {Component} from 'react';

class Repos extends Component {
    constructor() {
        super();
        this.state = {
            results: ''
        }
        this.GitUrl = "https://api.github.com/search/repositories";
        this.bodyRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.topic !== prevProps.topic || this.props.language !== prevProps.language) {
            this.fetchResults();
        }
    }

    componentDidMount() {
        this.fetchResults();
    }

    fetchResults = () => {
        this.setState({results: ''})
        const {topic, language} = this.props;

        fetch(`${this.GitUrl}?q=${topic}+language:${language}`, {
            method: 'GET',
            headers: this.headers
        }).then((response) => {
            if (!response.ok) {
                throw Error();
            }
            response
                .json()
                .then((data) => {
                    this.setState({results: data.items});
                    this.renderResults();
                })
        }).catch((error) => {
            console.log('Request failed', error);
        });
    }

    getCells = (name, date) => {
        let frag = document.createDocumentFragment();
        let newCell = document.createElement('td');
        newCell.textContent = name;
        frag.appendChild(newCell);

        newCell = document.createElement('td');
        newCell.textContent = date;
        frag.appendChild(newCell);
        return frag;
    }

    renderResults = () => {
        const data = this.state.results;
        const table = this.bodyRef.current;

        for (let i = 0; i < data.length; i++) {
            let cells = this.getCells(data[i].name, data[i].created_at)
            let newRow = table.insertRow();
            newRow.appendChild(cells);
        }
    }

    render() {
        return (
            <div>
                {this.state.results
                    ? <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Repository Name</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody ref={this.bodyRef}></tbody>
                        </table>
                    : <div>Spinning the spinner</div>}
            </div>
        )
    }
}

export default Repos;