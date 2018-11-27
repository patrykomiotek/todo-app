import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const API_URL = 'https://poniedzialek-d7900.firebaseio.com';
class App extends Component {

  state = {
    tasks: [],
    taskName: ''
  }

  handleChange = (event) => {
    this.setState({ taskName: event.target.value });
  }

  componentWillMount() {
    fetch(`${API_URL}/tasks.json`)
      .then(response => response.json())
      .then(data => {
        const array = Object.entries(data); //  index 0 - klucze, index 1 - obiekty zadań
        const tasksList = array.map(([id, values]) => {
          values.id = id; // stworzenie nowej właściwości w obiekcie zadania
          return values;
        });
        this.setState({ tasks: tasksList });
      });
  }

  handleClick = () => {
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

  render() {
    return (
      <div className="App">
        <div>
          <TextField
            hintText="Enter your task here"
            value={this.state.taskName}
            onChange={this.handleChange} />
          <FlatButton label="Add" primary={true} onClick={this.handleClick} />
        </div>
        <div>
          {this.state.tasks.map(task => (
            <div key={task.id}>{task.taskName}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
