import React from 'react';

import './Table.css';

export default class Table extends React.Component {

  render() {
    let {
      columns,
      rows
    } = this.props;

    return (
      <table className="table">
        <tbody>
          <tr className="header-row">
            {columns.map((col, index) => {
              return (
                <th {...(col.width ? { width: col.width } : {} )} key={`col-${index}`} className="header-cell">
                  {col.name}
                </th>
              )
            })}
          </tr>
          {
            rows.map((row, rowIndex) => {
              return(
                <tr key={`row-${rowIndex}`}>
                  {
                    row.map((cell, cellIndex) => {
                      return (
                        <td className="content-cell" key={`row-${rowIndex}-${cellIndex}`}>
                          {cell}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}