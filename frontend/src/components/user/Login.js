import React from 'react'
import { post } from 'axios'
import Auth from '../lib/Auth'

class Login extends React.Component {
  state = {
    data: {
      email: '',
      password: ''
    }
  }

  handleChange = ({ target: { name, value } }) => {
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await post('api/login', this.state.data)
      Auth.setToken(data.token)
      this.props.history.push(`profile/${Auth.getPayload().sub}`)
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

            <h1 className="title">Login</h1>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
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
                    className="input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleChange}
                    value={data.password} />
                </div>
              </div>
              <button className="button">Submit</button>
            </form>

          </div>
        </div>
      </div>
    )
  }
}

export default Login