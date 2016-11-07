import React, { Component } from 'react'
// import '../App.css'
import axios from 'axios'
const axiosCustom = axios.create({
  headers: {'Accept': 'application/vnd.github.v3.text-match+json'}
})

import Codemirror from 'react-codemirror'
import AceEditor from 'react-ace'

import brace from 'brace';
import 'brace/mode/javascript';

import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_light';
import 'brace/ext/language_tools';

class Code extends Component {
  componentWillMount() {
    this.state = {
      code: '',
      selectedWord: '',
      repoName: '',
      username: '',
      searchResults: []
    }

    const {url} = this.props.location.state

    axios.get(url)
    .then((res)=>{ 
      const code = atob(res.data.content) // decodes from base64
      this.setState({code: code})     
    })

    const {repoName, username} = this.props.location.state
    console.log('props.loation',this.props.location)
    this.setState({repoName, username})
    
  } 

  onLoad(editor) {

    editor.on('mousemove', (e) => {
      const selectionRange = editor.getSelectionRange()
      const startLine = selectionRange.start.row
      const endLine = selectionRange.end.row

      const selectedWord = editor.session.getTextRange(selectionRange)
      this.setState({selectedWord})
    })
  }

  searchForReferences() {
    axiosCustom.get(`https://api.github.com/search/code?q=${this.state.selectedWord}+in:file+language:js+repo:${this.state.username}/${this.state.repoName}`)
    .then((res)=>{ 
      const searchResults = res.data.items
      console.log('ser',searchResults)
      searchResults.map((result)=>{
        result.text_matches.map((match)=>{ 
          console.log(match)
          axios.get(match.object_url)
          .then((res)=>{ 
            const code = atob(res.data.content)
            console.log('coy', code)
          })
        })
      })
      this.setState({searchResults})
    })
  }

  showResults() {
    const results = this.state.searchResults.map((result)=>{ 
      const textMatchesFragments = result.text_matches.map((match)=>{ 
        return (
          <div>
          <h4 className='codeFragment'>Code Fragment:</h4>
          <AceEditor
            className="aceEditor"
            theme="monokai"
            mode="javascript"
            value={match.fragment}
            height='100px'
            readOnly={true}
          />
          </div>
        )
      })
      return (
        <a target="_blank" className='list-group-item list-group-item-action' href={result.html_url}> {result.path} 
          {textMatchesFragments}
        </a>
      )
    })
    return (
      <ul>
        {results.length>0? <h4>the search term was found in these files</h4> :null}
        {results}

      </ul>
    )
  }

  render() {
    const options = {
      lineNumbers: true
    }

    return (
      <div>
        <h4>Highlight the word you want to find in this repo</h4>
        <button className='btn' onClick={this.searchForReferences.bind(this)}>search for selected word</button>
        {this.showResults()}
        <AceEditor
          className="aceEditor"
          theme="monokai"
          mode="javascript"
          value={this.state.code}
          readOnly={true}
          width='90%'
          onLoad={(editor)=>{this.onLoad.call(this, editor) } }
        />
      </div>

    );
  }
}

Code.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Code
