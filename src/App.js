import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Checkbox from 'material-ui/Checkbox';

const API_URL = 'https://poniedzialek-d7900.firebaseio.com';
class App extends Component {

  state = {
    tasks: [],
    taskName: ''
  }

  handleChange = (event) => {
    this.setState({ taskName: event.target.value });
  }

  loadData() {
    fetch(`${API_URL}/tasks.json`)
    .then(response => response.json())
    .then(data => {
      if (!data) {
        this.setState({ tasks: [] });
        return;
      }
      const array = Object.entries(data); //  index 0 - klucze, index 1 - obiekty zadań
      const tasksList = array.map(([id, values]) => {
        values.id = id; // stworzenie nowej właściwości w obiekcie zadania
        return values;
      });
      this.setState({ tasks: tasksList });
    });
  }

  componentWillMount() {
    this.loadData();
  }

  addTask = () => {
    if (this.state.taskName !== '') {
      let tasks = this.state.tasks;
      let newTask = { taskName: this.state.taskName, completed: false };
      fetch(`${API_URL}/tasks.json`, {
        method: 'POST',
        body: JSON.stringify(newTask)
      })
      .then(response => response.json())
      .then(data => {
        newTask.id = data.name;
        tasks.push(newTask);
        this.setState({ tasks, taskName: '' });
      });
    }
  }

  handleClick = () => {
    this.addTask();
  }

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.addTask();
    }
  }

  testHandle = task => {
    console.log(task);
  }

  handleDelete = (id) => {
    fetch(`${API_URL}/tasks/${id}.json`, {
      method: 'DELETE'
    })
    .then(() => {
      this.loadData();
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <TextField
            hintText="Enter your task here"
            value={this.state.taskName}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange} />
          <FlatButton label="Add" primary={true} onClick={this.handleClick} />
        </div>
        <List>
          {this.state.tasks.map(task => (
            <ListItem
              key={task.id}
              primaryText={task.taskName}
              leftCheckbox={<Checkbox />}
              rightIcon={<DeleteIcon onClick={() => this.handleDelete(task.id)} />}
              />
          ))}
        </List>
      </div>
    );
  }
}

export default App;
