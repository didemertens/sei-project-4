import React from 'react'
import Select from 'react-select'
import { post } from 'axios'
import Auth from './lib/Auth'

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
    { value: 3, label: 'Ruby' }
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
            <h1>New Question</h1>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={this.handleChange}
                    value={data.title} />
                </div>
              </div>

              <div className="field">
                <label className="label">Text</label>
                <div className="control">
                  <textarea
                    className="input"
                    type="text"
                    placeholder="Text"
                    name="text"
                    onChange={this.handleChange}
                    value={data.text} />
                </div>
              </div>

              <div className="field">
                <label className="label">Language(s)</label>
                <div className="control">
                  <Select
                    options={this.options}
                    isMulti
                    onChange={this.handdleMultiChange}
                  />
                </div>
              </div>
              <button className="button">Submit</button>
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