import { Router, Route, browserHistory } from 'react-router'
import React, { Component } from 'react';

import App from './components/App';
import Repos from './components/Repos'
import Commits from './components/Commits'
import Code from './components/Code'


export default class Routes extends Component {
  render() {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={App} >
          <Route path="/repos" component={Repos} />
          <Route path="/commits" component={Commits} />
          <Route path="/code" component={Code} />
        </Route>
      </Router>
    );
  }
}
