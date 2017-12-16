import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BooksGrid from "./BooksGrid"
import SearchBar from "./SearchBar"


class BooksApp extends React.Component {
  state = {
    mybooks: new Map(),
    searchResults: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      const mybooks = new Map(books.map((b) => [b.id, b]))
      this.setState({ mybooks })
    })
  }

  handleShelfChangeEvent = (book, e) => {
    const fromShelf = book.shelf || 'none'
    const toShelf = e.target.value
    if (fromShelf === toShelf)
      return

    this.setState((prevState) => {
      book.shelf = toShelf
      const mybooks = prevState.mybooks
      mybooks.set(book.id, book)
      return { mybooks }
    })

    BooksAPI.update(book, toShelf)
  }

  handleSearchResultsUpdate = (books) => {
    this.setState((prevState) => {
      const mybooks = prevState.mybooks
      books.forEach(b => {
        if (mybooks.has(b.id))
          b.shelf = mybooks.get(b.id).shelf
      });
      return { searchResults: books }
    })
  }

  render() {
    return (
      <div className="app">
        <Route path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search" onClick={() => this.setState({ searchResults: [] })}>Close</Link>
              <div className="search-books-input-wrapper">
                <SearchBar onReturnSearchResults={this.handleSearchResultsUpdate} />
              </div>
            </div>
            <div className="search-books-results">
              <div className="bookshelf-books">
                <BooksGrid books={this.state.searchResults} onChangeBookShelf={this.handleShelfChangeEvent} />
              </div>
            </div>
          </div>
        )} />
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <BooksGrid books={Array.from(this.state.mybooks.values()).filter(b => b.shelf === 'currentlyReading')}
                      onChangeBookShelf={this.handleShelfChangeEvent} />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <BooksGrid books={Array.from(this.state.mybooks.values()).filter(b => b.shelf === 'wantToRead')}
                      onChangeBookShelf={this.handleShelfChangeEvent} />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <BooksGrid books={Array.from(this.state.mybooks.values()).filter(b => b.shelf === 'read')}
                      onChangeBookShelf={this.handleShelfChangeEvent} />
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
