import React from 'react';
import './App.css';

var BACKEND_ENTRYPOINT = process.env.REACT_APP_BACKEND_ENDPOINT;
console.log('backend: ' + BACKEND_ENTRYPOINT);

const axios = require('axios').create({
  baseURL: BACKEND_ENTRYPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json' 
});


class ChatControlUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.message.value.length === 0)
      return;

    this.props.callback(this.message.value);
    this.message.value = "";
  }

  render() {
    return (
      <div className="UI">
        <form onSubmit={this.handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td><label>Message:</label></td>
                <td>
                  <input
                    className="MessageTextBox"
                    type="text"
                    placeholder="message"
                    ref={(input) => {this.message = input;}}
                  />
                </td>
                <td><input type="submit" value="Send" /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

function ChatEntryList(props) {
  const entries =
        props.entries.map(
          (e) =>
            <tr>
              <td>{ e.timestamp.toLocaleString() }</td>
              <td>{ e.message }</td>
            </tr>
        );
  return entries;
}

class ChatBoard extends React.Component {
  render() {
    return (   
      <div className="ChatBoard">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <ChatEntryList key={this.props.key} entries={this.props.entries}/>
          </tbody>
        </table>
      </div>
    );
  }
}

function WarningBanner(props) {
  if (!props.message || props.message.length === 0)
    return null;

  return (
    <div className="Warning">
      { props.message }
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.nexttKey = 1;
    this.state = { entries: [], lastUpdatedAt: null };
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.timer = null;
  }

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages() {
    clearInterval(this.timer);

    axios.get('/read')
      .then((response) => {
        this.setState({ entries: response.data });
      })
      .catch((error) => {
        this.setState({ warningMessage: error.toString() });
        console.log(error);
      })
      .then(() => {
        this.timer = setInterval(this.fetchMessages.bind(this), 10000);
        this.setState({ lastUpdatedAt: (new Date()).toString() });
      });
  }

  handleNewMessage(message) {
    axios
      .post('/publish', {
        message: message
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        this.setState({ warningMessage: error.toString() });
        console.log(error);
      })
      .then(() => {
        this.fetchMessages();
      });
  }

  render() {
    return (
      <div className="App">
        <WarningBanner message={this.state.warningMessage} />
        <div className="Title">React Chat</div>

        <ChatControlUI callback={this.handleNewMessage}/>

        <div>
          <p>Last Update: {this.state.lastUpdatedAt}</p>
        </div>
        <ChatBoard entries={this.state.entries} />
      </div>
    );
  }
}

export default App;
