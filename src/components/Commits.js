import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'


class Commits extends Component {
  componentWillMount() {
    this.state = {
      tree: [],
      username: '', 
      repoName: ''
    }

    const {latestCommitTreeSha, repoName, username} = this.props.location.query
    this.setState({
      repoName,
      username
    })
    this.getTree(username, repoName, latestCommitTreeSha)
  } 

  getTree(username, repoName, treeSha) {
    return axios.get(`https://api.github.com/repos/${username}/${repoName}/git/trees/${treeSha}`)
    .then((res)=>{ 
      const tree = res.data.tree
      this.setState({tree})
    })
  }

  handleClick(link) {
    if(link.type==='blob') {
      // display code
      this.context.router.push({
        pathname: '/code',
        state: {
          url: link.url,
          username: this.state.username,
          repoName: this.state.repoName
        }

      })
    } else if(link.type==='tree') {
      this.getTree(this.state.username, this.state.repoName, link.sha)
    }
  }

  displayTree() {
    console.log(this.state.tree)

    return (
      <ul className="list-group">
      {this.state.tree.map(link=>{ return <a href='#' className="list-group-item list-group-item-action" onClick={this.handleClick.bind(this,link)}> {link.path} </a> }) }
      </ul>
    )
  }
  render() {
    return (
      <div>
        <h3>Files</h3>
        {this.displayTree()}
      
      </div>

    );
  }
}

Commits.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Commits;
