import React, { Component } from "react"
import PropTypes from "prop-types"
import escapeRegExp from 'escape-string-regexp'


class BooksGrid extends Component {

    static PropTypes = {
        books: PropTypes.array.isRequired,
        onChangeBookShelf: PropTypes.func.isRequired
    }

    state = {
        query: ''
    }

    updatequery = query => {
        this.setState({ query: query.trim() })
    }

    clearquery = query => {
        this.setState({ query: '' })
    }

    render() {
        const { books, onChangeBookShelf } = this.props
        const { query } = this.state

        let showingBooks
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            showingBooks = books.filter(book => match.test(book.title))
        } else {
            showingBooks = books
        }

        return (
            <ol className='books-grid'>
                {showingBooks.map((book) => (
                    <li key={book.id} >
                        <div className="book">
                            <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                    <select value={book.shelf} onChange={onChangeBookShelf.bind(this, book)}>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors}</div>
                        </div>
                    </li>
                ))}
            </ol>
        )
    }
}

export default BooksGrid