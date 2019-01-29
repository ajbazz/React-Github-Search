import React, {Component} from 'react';
import Spinner from './images/spin1.gif'

class Repos extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            loading: false,
            noResults: false
        }
        this.noResults = false;
        this.loading = false;
        this.GitUrl = "https://api.github.com/search/repositories";
        this.bodyRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.topic !== prevProps.topic || this.props.language !== prevProps.language) {
            this.fetchResults();
            this.noResults = false;
        }
    }

    componentDidMount() {
        this.fetchResults();
    }

    fetchResults = () => {
        this.setState({results: '', loading: true, noResults: false})
        // this.loading = true;
        // this.noResults = false;

        const {topic, language} = this.props;
        fetch(`${this.GitUrl}?q=${topic}+language:${language}&username=ajbazz&password=734c87ca83cdc84a7d9683b28f11f80acd958d83`, {
            method: 'GET',
            headers: this.headers
        }).then((response) => {
            if (!response.ok) {
                throw Error();
            }
            response
                .json()
                .then((data) => {
                    this.renderResults(data);
                })
        }).catch((error) => {
            console.log('Request failed', error);
        });
    }

    getCells = (link, name, date) => {
        let frag = document.createDocumentFragment();
        let newCell = document.createElement('td');
        let repoLink = document.createElement('a');
        let repoDate = new Date(date);
        let formatDate = (repoDate.getMonth() + 1) + '/' + repoDate.getDate() + '/' +  repoDate.getFullYear();

        repoLink.setAttribute('href', link);
        repoLink.setAttribute('target', '_blank');
        repoLink.textContent = name;
        newCell.appendChild(repoLink);
        frag.appendChild(newCell);

        newCell = document.createElement('td');
        newCell.textContent = formatDate;
        frag.appendChild(newCell);
        return frag;
    }
    

    renderResults = (data) => {
        if (data.total_count === 0) {
            this.setState({loading: false, noResults: true});
        } else {
            const table = this.bodyRef.current;
            const dataItems = data.items
            let cells, newRow = '';


            
            let sortItems = dataItems;
            sortItems.sort((a, b) => {
                let aDate = new Date(a.created_at);
                let bDate = new Date(b.created_at);
                if (aDate.getTime() > bDate.getTime()) {
                  return 1;
                } else if (aDate.getTime() < bDate.getTime()) {
                  return -1;
                }
                return 0;
            })



            for (let i = 0; i < dataItems.length; i++) {
                cells = this.getCells(dataItems[i].html_url, dataItems[i].name, dataItems[i].created_at)
                newRow = table.insertRow();
                newRow.appendChild(cells);
            }

            
            this.setState({results: sortItems, loading: false});

        }
    }

    render() {
        const {topic, language} = this.props;
        return (
            <div>
                <img
                    className={this.state.loading
                    ? "spinner"
                    : "spinner d-none"}
                    src={Spinner}
                    alt="Results loading"/>

                <div
                    className={this.state.noResults
                    ? "noResults d-block mt-3"
                    : "d-none"}>No repositories found for given criteria.</div>

                <div
                    className={this.state.results.length
                      ? "d-block"
                      : "d-none"}>
                    <div className="criteria">Repositories found for search term "{topic}" and language {language}</div>
                    <table className="table table-striped table-light table-hover text-left">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Repository Name</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody ref={this.bodyRef}></tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Repos;