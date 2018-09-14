import React, { Component } from 'react';

import SearchView from './Views/Search';
import FavouritesView from './Views/Favourites';

import './App.css';

class App extends Component {
  state = {
    favourites: []
  }

  addFavourites = records => {
    this.setState({
      favourites: this.state.favourites.concat(records)
    });
  }

  removeFavourites = recordsToRemove => {
    if (!recordsToRemove.length) return;
    /**
     * TODO: Store favourites in map for quicker deletion
     */
    const { favourites } = this.state;
    var favouritesToKeep = [];
    favourites.forEach(favourite => {
      // Is this favourite in recordsToRemove?
      if (!recordsToRemove.find(record => favourite.id === record.id)) {
        favouritesToKeep.push(favourite);
      }
    });
    this.setState({
      favourites: favouritesToKeep
    });
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
              addFavourites={this.addFavourites}
            />
          </div>
          <div className="Favourites-container">
            <FavouritesView
              favourites={this.state.favourites}
              removeFavourites={this.removeFavourites}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
