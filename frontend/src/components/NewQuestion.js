import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { post } from 'axios'
import Auth from './lib/Auth'
import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import { options } from './common/options'

const NewQuestion = ({ history }) => {
  const [data, setData] = useState({})
  const [text, setText] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [data, text])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const sendData = {
      ...data,
      ...text
    }
    try {
      const { data: { id } } = await post('/api/questions/', sendData,
        {
          headers: { Authorization: `Bearer ${Auth.getToken()}` }
        })
      history.push(`/questions/${id}`)
    } catch (err) {
      setError({ error: err })
    }
  }

  return (
    <div className="section">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="has-text-centered">
            <h1 className="title">Ask a Question</h1>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  required={true}
                  className="input"
                  type="text"
                  placeholder="Title"
                  name="title"
                  onChange={({ target: { name, value } }) => setData({ ...data, [name]: value })}
                />
              </div>
            </div>
            <SunEditor
              onChange={(content) => setText({ ...text, text: content })}
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
                  onChange={(selected) => {
                    const languages = selected ? selected.map(item => item.value) : []
                    setData({ ...data, languages: languages })
                  }}
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

export default NewQuestion