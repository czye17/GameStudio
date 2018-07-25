import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

class AddGame extends Component {
  constructor() {
    super();
    this.state = {
      newProject: {}
    };
  }
  static defaultProps = {
    categories: ['TicTacToe', 'Connect4']
  }

  handleSubmit(e) {
    if (this.refs.name.value === '') {
      alert('game name is required');
    } else {
      this.setState({
        newProject: {
          id: uuid.v4(),
          name: this.refs.name.value,
          category: this.refs.category.value
        }
      }, function () {
        this.props.addGame(this.state.newProject);
      });
    }
    e.preventDefault();
  }

  render() {
    var categoryOptions = this.props.categories.map(category => {
      return <option key={category} value={category}>{category}</option>
    });
    var textStyle = {
      color: 'white'
    };

    return (
      <div>
        <h3>Add Game</h3>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <label style={textStyle}>Create Game</label><br />
            <input type='text' ref='name'/>
          </div>
          <div>
            <select ref='category'>
              {categoryOptions}
            </select>
          </div>
          <input type='submit' value='submit' />
        </form>
      </div>
    );
  }
}

AddGame.propTypes = {
  categories: PropTypes.array,
  addGame: PropTypes.func
}

export default AddGame;
