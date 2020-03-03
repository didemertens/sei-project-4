import React from 'react'
import Select from 'react-select'
import { post } from 'axios'
import Auth from './lib/Auth'
import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import { options } from './common/options'

class NewQuestion extends React.Component {
  state = {
    data: {
      title: '',
      text: '',
      languages: []
    },
    error: ''
  }

  handleChange = ({ target: { name, value } }) => {
    const data = { ...this.state.data, [name]: value }
    this.setState({ data, error: '' })
  }

  handdleMultiChange = (selected) => {
    const languages = selected ? selected.map(item => item.value) : []
    const data = { ...this.state.data, languages }
    this.setState({ data, error: '' })
  }

  handleChangeEditor = (content) => {
    const data = { ...this.state.data, text: content }
    this.setState({ data, error: '' })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await post('/api/questions/', this.state.data,
        {
          headers: { Authorization: `Bearer ${Auth.getToken()}` }
        })
      this.props.history.push(`/questions/${data.id}`)
    } catch (err) {
      this.setState({ error: err })
      console.log(err)
    }
  }

  render() {
    const { data, error } = this.state
    return (
      <div className="section">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="has-text-centered">
              <h1 className="title">Ask a Question</h1>
            </div>
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
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor']
                  ]
                }}
              />

              <div className="field">
                <label className="label">Language(s)</label>
                <div className="control">
                  <Select
                    required={true}
                    options={options}
                    isMulti
                    onChange={this.handdleMultiChange}
                  />
                </div>
              </div>
              {error && <p className="is-size-7 error-message">Please check if all fields are filled in correctly</p>}
              <div className="has-text-centered">
                <button className="button is-warning">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div >
    )
  }
}

export default NewQuestion