import React, { Component } from 'react';

import SearchView from './Views/Search';
import FavouritesView from './Views/Favourites';

import './App.css';

class App extends Component {
  state = {
    favourites: new Map()
  }

  addFavourite = record => {
    let { favourites } = this.state;
    if (favourites.has(record.id)) return;

    this.setState({
      favourites: favourites.set(record.id, record)
    });
  }

  removeFavourite = recordToRemove => {
    let { favourites } = this.state;
    favourites.delete(recordToRemove.id);
    this.setState({ favourites });
  }

  render() {
    console.log("Favourites: ", this.state.favourites);

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
