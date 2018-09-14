import React, { Component } from 'react';
import axios from 'axios';

import './Search.css';

export default class Search extends Component {

  state = {}

  executeQuery = async () => {
    const { searchTerm } = this.state;

    let { repoAuthor, repoName } = this.parseInput(searchTerm);

    let data = {
      query: `query {
        organization(login: ${repoAuthor}) {
          repositories(first: 10){
            edges{
              node{
                name
              }
            }
          }
        }
      }`
    };

    let response = await axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {
        'Authorization': `bearer 9bfcabc74839305e7ccd55cb9bef3b2bf740573a`
      },
      data: JSON.stringify(data)
    });

    if (response.data.errors) {
      this.setState({ results: [] });
    } else {
      let results = response.data.data.organization.repositories.edges;
      let nodes = results.map(repo => repo.node);
      this.setState({
        results: nodes
      });
    }
  }

  /**
   * Interpret intent from input; ie if Shopify/active_shipping,
   * split into an author (Shopify) and a repo name (active_shipping)
   */
  parseInput(text) {
    var split = text.split(/\//g);
    if (typeof split !== 'array') split = [split];
    return {
      repoAuthor: split[0],
      repoName: split[1]
    }
  }

  onChangeInput = (event) => {
    let value = event.target.value;
    this.setState({ searchTerm: value });
    if (!value) this.setState({ results: [] });
  }

  getResultsJSX = () => {
    const { results } = this.state;
    if (!results) return null;
    return results.map(result => {
      return (
        <div key={result.name}>
          {result.name}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="layout">
        <div className="search-interface">
          <input
            className="input"
            placeholder="Enter an organization or user here to browse repos"
            onChange={this.onChangeInput}
          />
          <button
            className="button"
            onClick={this.executeQuery}
          >
            Search
          </button>
        </div>
        <div className="results-container">
          {this.getResultsJSX()}
        </div>
      </div>
    )
  }
}