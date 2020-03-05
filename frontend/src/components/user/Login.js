import React, { useState } from 'react'
import { post } from 'axios'
import Auth from '../lib/Auth'

const Login = ({ history }) => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await post('api/login', formData)
      Auth.setToken(data.token)
      history.push(`profile/${Auth.getPayload().sub}`)
    } catch (err) {
      setError(err)
      console.log(err)
    }
  }

  return (
    <div className="section">
      <div className="columns">
        <div className="column is-4 is-offset-4">
          <div className="has-text-centered">
            <h1 className="title">Log in</h1>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  required={true}
                  className="input"
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email || ''}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  required={true}
                  className="input"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password || ''}
                />
              </div>
            </div>

            {error && <p className="is-size-7 error-message">Invalid credentials</p>}
            <div className="has-text-centered">
              <button className="button is-warning">Submit</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login