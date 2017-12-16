import React, { Component } from "react";
import * as BooksAPI from './BooksAPI'
import PropTypes from "prop-types"

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

class SearchBar extends Component {
    static PropTypes = {
        onReturnSearchResults: PropTypes.func.isRequired
    }

    state = {
        value: ''
    }

    componentWillMount() {
        this.timer = null
    }
    
    componentWillUnmount() {
        this.props.onReturnSearchResults(new Array(0))
    }

    handleChange = (e) => {
        clearTimeout(this.timer)
        this.setState({
            value: e.target.value
        })
        this.timer = setTimeout(this.doSearch, WAIT_INTERVAL)
    }

    handleKeyDown = (e) => {
        if (e.keyCode === ENTER_KEY) {
            this.doSearch()
        }
    }

    doSearch = () => {
        const searchTerm = this.state.value.trim()
        if (searchTerm.length > 0) {
            BooksAPI.search(searchTerm).then(books => {
                if (books.length > 0)
                    this.props.onReturnSearchResults(books)
                else
                    this.props.onReturnSearchResults(new Array(0))
            })
        } else {
            this.props.onReturnSearchResults(new Array(0))
        }
    }

    render() {
        return (
            <input
                type="text"
                placeholder="Search by title or author"
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            />
        )
    }
}

export default SearchBar