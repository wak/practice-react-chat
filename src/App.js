import React from 'react';
import './App.css';
import moment from 'moment';

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


function date_to_timestamp(date) {
  if (!date)
    return null;
  return moment(date).format('YYYY/MM/DD hh:mm:ss');
}

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
              <td className="Timesgamp">{ date_to_timestamp(e.timestamp) }</td>
              <td className="Message">{ e.message }</td>
            </tr>
        );
  return entries;
}

class ChatBoard extends React.Component {
  render() {
    return (   
      <div className="ChatBoard">
        <p>Last Update: { date_to_timestamp(this.props.lastUpdatedAt) }</p>
        <table>
          <thead>
            <tr>
              <th className="Timestamp">Timestamp</th>
              <th className="Message">Message</th>
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
      <pre>
        { props.message }
      </pre>
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
        this.setState({ warningMessage: "read message failed: " + error.stack });
        console.log(error);
      })
      .then(() => {
        this.timer = setInterval(this.fetchMessages.bind(this), 10000);
        this.setState({ lastUpdatedAt: (new Date()) });
      });
  }

  handleNewMessage(message) {
    axios
      .post('/publish', {
        message: message
      })
      .then((response) => {
        console.log(response);
        this.fetchMessages();
      })
      .catch((error) => {
        this.setState({ warningMessage: "send message failed: " + error.stack });
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <WarningBanner message={this.state.warningMessage} />
        <div className="Title">React Chat</div>

        <ChatControlUI callback={this.handleNewMessage}/>
        <ChatBoard lastUpdatedAt={this.state.lastUpdatedAt} entries={this.state.entries} />
      </div>
    );
  }
}

export default App;
