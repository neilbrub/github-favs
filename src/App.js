import React, { Component } from 'react';
import Cookies from 'js-cookie';

import SearchView from './Views/Search';
import FavouritesView from './Views/Favourites';

import './App.css';

class App extends Component {
  state = {
    favourites: this.loadFavourites()
  }

  /**
   * Load in favourites saved in browser cookie
   */
  loadFavourites() {
    let saved = Cookies.getJSON('favourites');
    
    // convert parsed cookie to map
    if (saved) saved = new Map(saved);
    else saved = new Map();
    
    return saved;
  }

  addFavourite = recordToAdd => {
    let { favourites } = this.state;
    if (favourites.has(recordToAdd.id)) return;

    let updatedFavs = favourites.set(recordToAdd.id, recordToAdd);

    this.setState({
      favourites: updatedFavs
    });

    Cookies.set('favourites', JSON.stringify([...updatedFavs]));
  }

  removeFavourite = recordToRemove => {
    let { favourites } = this.state;
    favourites.delete(recordToRemove.id);
    this.setState({ favourites });

    Cookies.set('favourites', JSON.stringify([...favourites]));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Github Favourites</h1>
        </header>

        <div className="App-body">
          <div className="Search-container">
            <SearchView
              favourites={this.state.favourites}
              addFavourite={this.addFavourite}
            />
          </div>
          <div className="Favourites-container">
            <FavouritesView
              favourites={this.state.favourites}
              removeFavourite={this.removeFavourite}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
