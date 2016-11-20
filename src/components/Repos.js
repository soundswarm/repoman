import React, { Component } from 'react';
import axios from 'axios'
const axiosCustom = axios.create({
  headers: {'Accept': 'application/vnd.github.v3.text-match+json'}
})
import bluebird from 'bluebird'
import OAuth from 'oauthio-web'
OAuth.initialize('')

class Repos extends Component {
  componentWillMount() {
    this.state = {
      username: '',
      repos: []
      // latestCommitTreeSha: ''

    }

    axios.get('https://api.github.com/users')
    .then((res)=>{ 
      const users = res.data

      return bluebird.each(users, (user)=>{ 
        return bluebird.delay(6000)
        .then(()=>{ 
          const userName = user.login
          return axios.get(user.repos_url)
          .then((res)=>{ 
            const repos = res.data
            return bluebird.each(repos, (repo)=>{ 
              const repoName = repo.name
              // const searchTerm = 
              const searchCode = `https://api.github.com/search/code?q=/repoman/+in:file+repo:${userName}/${repoName}`
              return axiosCustom.get(searchCode)
              .then((res)=>{ 
                console.log('codedata',res.data)
                return res.data
              })
            })          
          })
        })
       
      })
     
    })

  } 
   handleChange(event) {
    this.setState({username: event.target.value})
  }

  handleClick() {
     axios.get(`https://api.github.com/users/${this.state.username}/repos`)
    .then((res)=>{ 
      const repos = res.data
      console.log(repos)
      this.setState({repos})
    })

  }
  getRepoCommits(repoName) {
    axios.get(`https://api.github.com/repos/${this.state.username}/${repoName}/commits`)
    .then((res)=>{ 
      const latestCommitTreeSha = res.data[0].commit.tree.sha
      this.setState({latestCommitTreeSha})
      this.context.router.push({
        pathname: '/commits',
        query: {
          username: this.state.username,
          repoName,
          latestCommitTreeSha
        }
      })
      this.getCommitTree(this.state.username, repoName, latestCommitTreeSha)
    })
  }
  getCommitTree(username, repoName, commitTreeSha) {
    
  }
  repos() {
    return (
      <ul>
       {this.state.repos.map((repo)=>{
        if(!repo.fork){
         return <a href='#' className="list-group-item list-group-item-action" onClick={this.getRepoCommits.bind(this, repo.name)}>
         {repo.name}
         </a> 
        }
        })
       }
      </ul>
    )
  }
  render() {
    return (
      <div>
        <h2> Enter your Github Username</h2>
        <input onChange={this.handleChange.bind(this)} value={this.state.username}/>
        <button onClick={this.handleClick.bind(this)}>Submit</button>
        {this.state.repos.length>0? <h3>Select one of your repos</h3> :null}
        {this.repos()}
      </div>
    );
  }
}
Repos.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Repos
