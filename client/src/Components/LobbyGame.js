import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LobbyGame extends Component {

  render() {
    var rowStyle = {
      height: 100,
      backgroundColor: 'orange',
      flex: 1,
      alignItems: 'stretch'
    };
    var cellStyle1 = {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'stretch'
    };
    var cellStyle2 = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch'
    }
    return (
      <tr className="Game" style={rowStyle}>
        <td style={cellStyle1}><strong>{this.props.game.name} </strong></td>
        <td style={cellStyle1}>Host: {this.props.game.playerOne}</td>
        <td style={cellStyle2}>Game: {this.props.game.category}</td>
        <td style={cellStyle2}>Join Game</td>
      </tr>
    );
  }
}

LobbyGame.propTypes = {
  project: PropTypes.object
}

export default LobbyGame;
