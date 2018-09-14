import React, { Component } from 'react';
import _ from 'lodash';

import Table from '../Components/Table';
import './Favourites.css';

export default class Favourites extends Component {

  getFavouritesTable() {
    const { favourites, removeFavourite } = this.props;
    if (!favourites.size) return null;

    let columns = [
      { name: 'Name' },
      { name: 'Language' },
      { name: 'Latest Tag' },
      { name: '' }
    ];

    let rows = [];
    favourites.forEach(repo => {
      rows.push(
        [
          (<a href={repo.url} target="_blank"><div>{`${repo.owner.login}/${repo.name}`}</div></a>),
          (<div>{_.get(repo, ['primaryLanguage', 'name'], '-')}</div>),
          (<div>-</div>),
          (<div className="action-text" onClick={() => { removeFavourite(repo) }}>Remove</div>)
        ]
      )
    });

    return (
      <Table
        columns={columns}
        rows={rows}
      />
    )
  }
  render() {
    return (
      <div className="favourites-container">
        {this.getFavouritesTable()}
      </div>
    )
  }
}
