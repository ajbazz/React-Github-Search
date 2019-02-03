import React, {Component} from 'react';
import Spinner from './images/spin1.gif';
import {FaCaretDown, FaCaretUp} from "react-icons/fa";

class Repos extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            loading: false,
            noResults: false,
            sortDesc: true
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
        this.setState({results: [], loading: true, noResults: false, sortDesc: true})

        const {topic, language} = this.props;
        fetch(`${this.GitUrl}?q=${topic}+language:${language}&username=REACT_APP_GITHUB_USER&password=REACT_APP_GITHUB_TOKEN&per_page=100`, {
            method: 'GET',
            headers: this.headers
        }).then((response) => {
            if (!response.ok) {
                throw Error();
            }
            response
                .json()
                .then((data) => {
                    this.renderResults(data.items);
                })
        }).catch((error) => {
            console.log('Request failed', error);
        });
    }

    sortByDate = (dataItems) => {
        let sortItems = (dataItems.length)
            ? dataItems
            : this.state.results;
        let sorter = (!this.state.sortDesc)
            ? true
            : false;
        let sortNum = (sorter)
            ? 1
            : -1;

        sortItems.sort((a, b) => {
            let aDate = new Date(a.created_at);
            let bDate = new Date(b.created_at);
            if (aDate.getTime() > bDate.getTime()) {
                return sortNum;
            } else if (aDate.getTime() < bDate.getTime()) {
                return -sortNum;
            }
            return 0;
        })

        this.setState({sortDesc: sorter});
        return sortItems;
    }

    getCells = (link, name, desc, date) => {
        let frag = document.createDocumentFragment();
        let description = (desc) ? desc : "(no description available)"

        //Attach repo name and link
        let newCell = document.createElement('td');
        let repoLink = document.createElement('a');
        repoLink.setAttribute('href', link);
        repoLink.setAttribute('target', '_blank');
        repoLink.textContent = name;
        newCell.appendChild(repoLink);
        frag.appendChild(newCell);

        //Attach repo description
        newCell = document.createElement('td');
        newCell.textContent = description;
        frag.appendChild(newCell);

        //Format date as mm/dd/yyyy and add leading zeros to line up column
        let repoDate = new Date(date);
        let leadingZeroM = (repoDate.getMonth() + 1 < 10)
            ? '0'
            : '';
        let leadingZeroD = (repoDate.getDate() < 10)
            ? '0'
            : '';
        let formatDate = `${leadingZeroM}${repoDate.getMonth() + 1}/${leadingZeroD}${repoDate.getDate()}/${repoDate.getFullYear()}`;

        newCell = document.createElement('td');
        newCell.textContent = formatDate;
        frag.appendChild(newCell);
        return frag;
    }

    renderResults = (data) => {
        if (!data.length) {
            this.setState({loading: false, noResults: true});
        } else {
            const tableBody = this.bodyRef.current;
            let dataItems = data;
            let cells,
                newRow;
            let sortedItems = this.sortByDate(dataItems);

            tableBody.innerHTML = "";
            for (let i = 0; i < sortedItems.length; i++) {
                cells = this.getCells(sortedItems[i].html_url, sortedItems[i].name, sortedItems[i].description, sortedItems[i].created_at)
                newRow = tableBody.insertRow();
                newRow.appendChild(cells);
            }
            this.setState({results: sortedItems, loading: false});
        }
    }

    handleColumnClick = (event) => {
        event.preventDefault();
        this.renderResults(this.state.results);
    }

    render() {
        const {topic, language} = this.props;
        const resultCount = (this.state.results.length === 100) ? "100+" : this.state.results.length;

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
                    <div className="criteria">{resultCount} Repositories found for search term "{topic}" in {language}</div>
                    <div className="tableContainer mb-4">
                        <table className="table table-striped table-light table-hover text-left mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col" onClick={this.handleColumnClick}>
                                        <span>Date</span>
                                        <FaCaretDown
                                            className={(!this.state.sortDesc)
                                            ? "d-inline-block"
                                            : "d-none"}/>
                                        <FaCaretUp
                                            className={(!this.state.sortDesc)
                                            ? "d-none"
                                            : "d-inline-block"}/>
                                    </th>
                                </tr>
                            </thead>
                            <tbody ref={this.bodyRef}></tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Repos;