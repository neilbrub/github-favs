import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import Table from '../Components/Table';
import './Search.css';

export default class Search extends Component {

  state = {}

  executeQuery = async () => {
    const { searchTerm } = this.state;

    let { repoAuthor } = this.parseInput(searchTerm);

    /**
     * Query for organization and user; prioritize organization
     */
    let data = {
      query: `query {
        organization(login: ${repoAuthor}) {
          repositories(first: 10){
            edges{
              node{
                id
                name
                owner{
                  login
                }
                url
                primaryLanguage{
                  name
                }
                releases(last: 10){
                  edges{
                    node{
                      name
                      createdAt
                    }
                  }
                }
              }
            }
          }
        }
        user(login: ${repoAuthor}) {
          repositories(first: 10){
            edges{
              node{
                id
                name
                owner{
                  login
                }
                url
                primaryLanguage{
                  name
                }
                releases(last: 10){
                  edges{
                    node{
                      name
                      createdAt
                    }
                  }
                }
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

    let responseData = response.data.data;

    let results = [];
    if (responseData && responseData.organization) {
      results = _.get(responseData, ['organization', 'repositories', 'edges']);
    } else if (responseData && responseData.user) {
      results = _.get(responseData, ['user', 'repositories', 'edges']);
    }

    let nodes = results.map(repo => {

      var releases = _.get(repo, ['node', 'releases', 'edges']);
      var latestTag = '-';

      /**
       * Get latest tag
       */
      if (releases.length) {

        // Sort oldest to newest
        var sortedReleases = _.sortBy(releases, edge => {
          return new Date(edge.node.createdAt).valueOf();
        });

        // Pick last tag in the list with a name (this will be latest tag)
        sortedReleases.forEach(edge => {
          var name = edge.node.name;
          if (name) latestTag = name;
        });
      }

      return {
        ...repo.node,
        tag: latestTag
      }
    });

    this.setState({
      results: nodes
    });
  }

  /**
   * Separate input by / characters; allows user to type, ie:
   * 'Shopify/vision' and still get results for 'Shopify'
   */
  parseInput(text) {
    var split = text.split(/\//g);
    if (!(split instanceof Array)) split = [split];
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

  /**
   * Trigger api call on enter keypress
   */
  handleKeypress = (event) => {
    if (event.key === 'Enter') {
      this.executeQuery();
    }
  }

  getResultsJSX = () => {
    const { favourites, addFavourite } = this.props;
    const { results } = this.state;
    if (!results || !results.length) return null;

    let columns = [
      { name: 'Name' },
      { name: 'Language' },
      { name: 'Latest Tag' },
      { name: '' }
    ];

    let rows = results.map(result => {
      let actionJSX;
      if (favourites.has(result.id)) {
        actionJSX = (
          <div className="action-text-selected">
            Added
          </div>
        );
      } else {
        actionJSX = (
          <div
            className="action-text"
            onClick={() => { addFavourite(result) }}
          >
            Add
          </div>
        );
      }
      return (
        [
          (<a href={result.url} target="_blank"><div>{`${result.owner.login}/${result.name}`}</div></a>),
          (<div>{_.get(result, ['primaryLanguage', 'name'], '-')}</div>),
          (<div>{result.tag}</div>),
          actionJSX
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
      <div className="layout">
        <div className="search-interface">
          <input
            className="input"
            id="input"
            placeholder="Enter an organization or user here to browse repos"
            onChange={this.onChangeInput}
            onKeyPress={this.handleKeypress}
          />
          <button
            className="button"
            id="search-button"
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