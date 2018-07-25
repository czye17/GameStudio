import React, { Component } from 'react';
import Lobby from './Components/Lobby';
import AddGame from './Components/AddGame';

class App extends Component {
  constructor() {
    super();
    this.state = {
      lobby: {
        'sampleGame': {
          id: 'sampleID',
          name: 'sampleGameName',
          inLobby: true,
          inProgress: false
        }
      }
    }
  }

  componentDidMount() {
  }

  handleAddGame(game) {
    var games = this.state.lobby;
    games[game.id] = game;
    this.setState({ lobby: games });
  }

  render() {
    var headStyle = {
      color: 'white',
      textAlign: 'center'
    };
    var divStyle = {
      backgroundColor: 'black',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch'
    };
    return (
      <div className='App'>
        <div id='main' style={divStyle}>
          <h1 style={headStyle}>Tic Tac Toe</h1>
        </div>

        <div id='lobby' style={divStyle}>
          <Lobby lobby={this.state.lobby} />
        </div>

        <div id='addGames' style={divStyle}>
          <AddGame addGame={this.handleAddGame.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
