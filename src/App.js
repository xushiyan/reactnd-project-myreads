import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BooksGrid from "./BooksGrid"
import SearchBar from "./SearchBar"


class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: [],
    none: [],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    searchResults: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState((prevState) => {
        books.forEach(b => {
          // TODO: 
          prevState[b.shelf].push(b)
        });
      })
    })
  }

  handleShelfChangeEvent = (book, e) => {
    const fromShelf = book.shelf
    const toShelf = e.target.value
    if (fromShelf === toShelf)
      return

    book.shelf = toShelf

    this.setState((prevState) => {
      return {
        [fromShelf]: prevState[fromShelf].filter(b => b.id !== book.id),
        [toShelf]: prevState[toShelf].concat([book])
      }
    })

    BooksAPI.update(book, e.target.value)
  }

  handleSearchResultsUpdate = (books) => {
    this.setState({
      searchResults: books
    })
  }

  render() {
    console.log(this.state.searchResults)
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                <SearchBar onReturnSearchResults={this.handleSearchResultsUpdate} />
                <div className="bookshelf-books">
                  <BooksGrid books={this.state.searchResults} onChangeBookShelf={this.handleShelfChangeEvent} />
                </div>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <div className="bookshelf-books">
                      <BooksGrid books={this.state.currentlyReading} onChangeBookShelf={this.handleShelfChangeEvent} />
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                    <div className="bookshelf-books">
                      <BooksGrid books={this.state.wantToRead} onChangeBookShelf={this.handleShelfChangeEvent} />
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    <div className="bookshelf-books">
                      <BooksGrid books={this.state.read} onChangeBookShelf={this.handleShelfChangeEvent} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="open-search">
                <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default BooksApp
