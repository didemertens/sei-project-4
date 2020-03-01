import React from 'react'
import Select from 'react-select'
import { post } from 'axios'
import Auth from './lib/Auth'
import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'

class NewQuestion extends React.Component {
  state = {
    data: {
      title: '',
      text: '',
      languages: []
    }
  }

  options = [
    { value: 1, label: 'JavaScript' },
    { value: 2, label: 'Python' },
    { value: 3, label: 'Ruby' },
    { value: 4, label: 'Java' },
    { value: 5, label: 'C++' },
    { value: 6, label: 'C#' },
    { value: 7, label: 'Swift' },
    { value: 8, label: 'Go' },
    { value: 9, label: 'PHP' },
    { value: 10, label: 'Scala' }
  ]

  handleChange = ({ target: { name, value } }) => {
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
  }

  handdleMultiChange = (selected) => {
    const languages = selected ? selected.map(item => item.value) : []
    const data = { ...this.state.data, languages }
    this.setState({ data })
  }

  handleChangeEditor = (content) => {
    const data = { ...this.state.data, text: content }
    this.setState({ data })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await post('/api/questions/', this.state.data, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.props.history.push(`/questions/${data.id}`)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { data } = this.state
    return (
      <div className="section">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <h1 className="title">Ask a Question</h1>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    required={true}
                    className="input"
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={this.handleChange}
                    value={data.title} />
                </div>
              </div>

              <SunEditor
                onChange={this.handleChangeEditor}
                required="True"
                lang="en"
                placeholder="Type your question here"
                setOptions={{
                  height: 200,
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle']
                  ]
                }}
              />

              <div className="field">
                <label className="label">Language(s)</label>
                <div className="control">
                  <Select
                    required={true}
                    options={this.options}
                    isMulti
                    onChange={this.handdleMultiChange}
                  />
                </div>
              </div>
              <button className="button is-warning">Submit</button>
            </form>
          </div>
        </div>
      </div >
    )
  }
}

export default NewQuestion


// {
// 	"title": "Comment on Ruby2",
// 	"text" : "jdjwej wkwek ewjjfjewjfjwe jfjw jjfjewjfjewj jwe",
// 	"languages": [1,2]
// }