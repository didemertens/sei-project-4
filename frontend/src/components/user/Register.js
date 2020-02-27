import React from 'react'
import Select from 'react-select'
import { post } from 'axios'

class Register extends React.Component {
  state = {
    data: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      image: '',
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
      await post('api/register', this.state.data)
      this.props.history.push('/login')
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { data } = this.state
    return (
      <div className="section">
        <h1 className="title">Register</h1>
        <form onSubmit={this.handleSubmit} className="form">

          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Username"
                name="username"
                onChange={this.handleChange}
                value={data.username} />
            </div>
          </div>

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

          <div className="field">
            <label className="label">Password confirmation</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                name="password_confirmation"
                onChange={this.handleChange}
                value={data.password_confirmation} />
            </div>
          </div>

          <div className="field">
            <label className="label">Profile picture</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Profile picture"
                name="image"
                onChange={this.handleChange}
                value={data.image} />
            </div>
          </div>

          <div className="field">
            <label className="label">Languages</label>
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
      </div >
    )
  }
}

export default Register