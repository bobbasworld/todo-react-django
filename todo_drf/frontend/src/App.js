import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    // this.strikeUnstrike = this.strikeUnstrike.bind(this)
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  fetchTasks() {
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        this.setState({
          todoList: data
        })
      })
  }

  componentDidMount() {
    this.fetchTasks()
  }

  handleChange(e) {
    var name = e.target.name
    var value = e.target.value
    // console.log("Name: ", name)
    // console.log("Title: ", title)
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    })
  }


  handleSubmit(e) {
    e.preventDefault()
    // console.log("ITEM: ", this.state.activeItem)
    const csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/task-create/'

    if (this.state.editing) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false
        },
        editing: false
      })
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken

      },
      body: JSON.stringify(this.state.activeItem)
    }
    fetch(url, requestOptions)
      .then(response => {
        this.fetchTasks()
        this.setState({
          activeItem: {
            id: null,
            title: '',
            completed: false,
          }
        })
      })
      .catch(error => console.log(error))
  }

  // handleEdit = (task) => {
  //   this.setState({
  //     activeItem: task,
  //     editing: true,
  //   })
  // }

  handleEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    })
  }

  handleDelete(task) {
    const csrftoken = this.getCookie('csrftoken')
    const url = `http://127.0.0.1:8000/api/task-delete/${task.id}`
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      }

    }

    fetch(url, requestOptions)
      .then(response => {
        this.fetchTasks()
        // this.setState({
        //   activeItem: {
        //     id: null,
        //     title: '',
        //     completed: false
        //   }
        // })
      })
      .catch(err => console.log(err))
  }

  // strikeUnstrike(task) {
  //   task.completed = !task.completed
  //   console.log("COMPLETED: ", task.completed)

  //   const csrftoken = this.getCookie('csrftoken')
  //   const url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //       'X-CSRFToken': csrftoken,
  //     },
  //     body: JSON.stringify({ 'completed': task.completed, 'title': task.title })
  //   }

  //   fetch(url, requestOptions)
  //     .then(response => {
  //       this.fetchTasks()
  //     })
  //     .catch(err => console.log(err))

  //   console.log('POST COMPLETED: ', task.completed)

  // }

  render() {
    var tasks = this.state.todoList

    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                </div>

                <div style={{ flex: 1 }}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map((task, index) => {
              return (
                <div className="task-wrapper flex-wrapper" key={index}>
                  <div style={{ flex: 7 }}>
                    <span>{task.title}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => this.handleEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => this.handleDelete(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
