import React, { useState } from 'react'
import Select from 'react-select'
import { post } from 'axios'
import ImageUpload from '../common/ImageUpload'
import { options } from '../common/options'

const Register = ({ history }) => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleMultiChange = (selected) => {
    const languages = selected ? selected.map(item => item.value) : []
    setFormData({ ...formData, languages })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await post('api/register', formData)
      history.push('/login')
    } catch (err) {
      setError(err)
      console.log(error)
    }
  }

  return (
    <div className="section">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="has-text-centered">
            <h1 className="title">Sign up</h1>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  required={true}
                  className="input"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Profile picture</label>
              <div className="control">
                {formData.image && <img className="reg-profile-image image is-96x96" src={formData.image} alt="Profile" />}
                <ImageUpload
                  name="imageURL"
                  handleChange={handleChange}
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
                  options={options}
                  isMulti
                  onChange={handleMultiChange}
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
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password confirmation</label>
              <div className="control">
                <input
                  required={true}
                  className="input"
                  type="password"
                  placeholder="Password"
                  name="password_confirmation"
                  onChange={handleChange}
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

export default Register