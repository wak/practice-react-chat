import React from 'react';
import './App.css';

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
            <ChatEntryList entries={this.props.entries}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.nexttKey = 1;
    this.state = { entries: [] };
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  handleNewMessage(message) {
    var entries = this.state.entries.slice();
    entries.unshift({ key: this.nextKey, timestamp: new Date(), message: message });
    this.setState({ entries: entries });
    this.nextKey += 1;
  }

  render() {
    return (
      <div className="App">
        <div className="Title">React Chat</div>

        <ChatControlUI callback={this.handleNewMessage}/>
        <ChatBoard entries={this.state.entries} />
      </div>
    );
  }
}

export default App;
