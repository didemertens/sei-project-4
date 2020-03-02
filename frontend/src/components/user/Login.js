import React from 'react'
import { post } from 'axios'
import Auth from '../lib/Auth'

class Login extends React.Component {
  state = {
    data: {
      email: '',
      password: ''
    },
    error: ''
  }

  handleChange = ({ target: { name, value } }) => {
    const data = { ...this.state.data, [name]: value }
    this.setState({ data, error: '' })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await post('api/login', this.state.data)
      Auth.setToken(data.token)
      this.props.history.push(`profile/${Auth.getPayload().sub}`)
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
          <div className="column is-4 is-offset-4">
            <div className="has-text-centered">
              <h1 className="title">Log in</h1>
            </div>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    required={true}
                    className="input"
                    type="text"
                    placeholder="Email"
                    name="email"
                    onChange={this.handleChange}
                    value={data.email} />
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
                    onChange={this.handleChange}
                    value={data.password} />
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
}

export default Login