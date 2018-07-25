import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LobbyGame from './LobbyGame';

class Lobby extends Component {
  deleteProject(id) {
    this.props.onDelete(id);
  }

  render() {
    var games = [];
    if (this.props.lobby) {
      for (var key in this.props.lobby) {
        games.push(<LobbyGame game={this.props.lobby[key]} />);
      }
    }
    var divStyle = {
      backgroundColor: 'powderblue',
      justifyContent: 'center', 
      alignItems: 'stretch',
      flex: 1
    };
    var headStyle = {
      textAlign: 'center'
    };
    var tableStyle = {
      justifyContent: 'center',
      width: 800,
      alignItems: 'center'
    }

    return (
      <div className="Lobby" style={divStyle}>
        <h3 style={headStyle}>Available Games</h3>
        <table style={tableStyle}>
          {games}
        </table>
      </div>
    );
  }
}

Lobby.propTypes = {
  lobby: PropTypes.array
}

export default Lobby;
