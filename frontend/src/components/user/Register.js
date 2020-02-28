import React from 'react'
import Select from 'react-select'
import { post } from 'axios'
import ImageUpload from '../common/ImageUpload'

class Register extends React.Component {
  state = {
    formData: {
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
    const formData = { ...this.state.formData, [name]: value }
    this.setState({ formData })
  }

  handdleMultiChange = (selected) => {
    const languages = selected ? selected.map(item => item.value) : []
    const formData = { ...this.state.formData, languages }
    this.setState({ formData })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await post('api/register', this.state.formData)
      this.props.history.push('/login')
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { formData } = this.state
    return (
      <div className="section">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
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
                    value={formData.username} />
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
                    value={formData.email} />
                </div>
              </div>

              <div className="field">
                <label className="label">Profile picture</label>
                <div className="control">
                  {formData.image && <img className="reg-profile-image" src={formData.image} alt="Profile" />}
                  <ImageUpload
                    name="imageURL"
                    handleChange={this.handleChange}
                    fieldName="image"
                    labelClassName="my-label-class"
                    inputClassName="my-input-class"
                  />
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

              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleChange}
                    value={formData.password} />
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
                    value={formData.password_confirmation} />
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

export default Register