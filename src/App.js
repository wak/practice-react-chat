import React from 'react';
import './App.css';

class SendMessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.value.length == 0)
      return;

    this.props.callback(this.state.value);
    event.preventDefault();
    this.setState({ value: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Message:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Send" />
      </form>
    );
  }
}

function ChatEntry(props) {
  return (
    <tr>
      <td>{ props.timestamp }</td>
      <td>{ props.message }</td>
    </tr>
  );
}

function ChatEntryList(props) {
  var options = {weekday: 'short', month: 'short', day: 'numeric' };
  
  const entries =
        props.entries.map(
          (e) =>
            <ChatEntry
              timestamp={e.timestamp.toLocaleString()}
              message={e.message}
            />
        );
  return entries;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { entries: Array() };
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  handleNewMessage(message) {
    var entries = this.state.entries.slice();
    entries.unshift({ timestamp: new Date(), message: message });
    this.setState({ entries: entries });
  }

  render() {
    return (
      <div className="App">
        <div className="Title">React Chat</div>
        <div className="UI">
          <SendMessageForm callback={this.handleNewMessage}/>
        </div>

        <div className="ChatBoard">
          <table>
            <tr>
              <th>Timestamp</th>
              <th>Message</th>
            </tr>
            <ChatEntryList entries={this.state.entries}/>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
