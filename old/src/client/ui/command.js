import React from 'react';

class Command extends React.Component {
  constructor(props) {
    super(props);
    //this.command = '';
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleChange(event) {
    console.log(event.target.value);
    //this.props.changeCommand(command);
  }

  render() {
    return (
      <div>
        <textarea id="commandhistory" />
        <input id="command" type="text" onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

export default Command;
