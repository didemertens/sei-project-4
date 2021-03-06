import React, { useState, useEffect } from 'react'
import ImageUpload from '../common/ImageUpload'
import axios from 'axios'
import Auth from '../lib/Auth'
import Select from 'react-select'
import { options } from '../../lib/options'

const ProfileEdit = ({ location, match, history }) => {
  const [userData, setUserData] = useState({})
  const [langOptions, setLangOptions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!location.state) {
      history.push('/profiles/')
    } else {
      const getData = () => {
        const data = location.state.userData
        const langOptions = []
        data.languages.forEach(language => {
          options.forEach(option => {
            if (option.value === language.id) {
              langOptions.push(option)
            }
          })
        })
        setUserData(data)
        setLangOptions(langOptions)
      }
      getData()
    }
  }, [history, location.state,])

  const handleChange = ({ target: { name, value } }) => {
    setError('')
    setUserData({ ...userData, [name]: value })
  }

  const handdleMultiChange = (selected) => {
    setError('')
    const languages = selected ? selected.map(item => item) : []
    setUserData({ ...userData, languages })

    const langOptions = []
    if (selected) {
      selected.forEach(language => {
        options.forEach(option => {
          if (option.value === language.value) {
            langOptions.push(option)
          }
        })
      })
    }
    setLangOptions(langOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const sendData = {
      username: userData.username,
      email: userData.email,
      languages: langOptions.map(language => language.value),
      image: userData.image
    }

    if (!sendData.languages.length) {
      setError('Please fill in all the fields')
      return
    }

    try {
      await axios.put(`/api/users/${match.params.id}/`, sendData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      history.goBack()
    } catch (err) {
      setError('Please check if all fields are filled in correctly')
    }
  }

  return (
    <div className="section">
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="has-text-centered">
            <h2 className="title">Edit your Profile</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div classame="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                  value={userData.username || ''}
                />
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
                  onChange={handleChange}
                  value={userData.email || ''}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Language(s)</label>
              <div className="control">
                <Select
                  options={options}
                  value={langOptions}
                  isMulti
                  onChange={handdleMultiChange}
                />
              </div>
            </div>
            <img className="image is-128x128" src={userData.image} alt={userData.username} />
            <ImageUpload
              name="image"
              handleChange={handleChange}
              fieldName="image"
              labelClassName="my-label-class"
              inputClassName="my-input-class"
            />
            {error && <p className="is-size-7 error-message">{error}</p>}
            <div className="has-text-centered">
              <button className="button is-warning">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div >
  )
}

export default ProfileEdit