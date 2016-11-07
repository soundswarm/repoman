import React, { Component } from 'react';
import '../App.css';

class App extends Component {
  componentDidMount() {
    this.context.router.push({pathname: '/repos'}) // I wouldn't normally do this but ran out of time
  }
  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>

    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}


export default App;
