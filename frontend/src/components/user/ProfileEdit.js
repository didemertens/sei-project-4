import React from 'react'
import ImageUpload from '../common/ImageUpload'
import axios from 'axios'
import Auth from '../lib/Auth'
import Select from 'react-select'


class ProfileEdit extends React.Component {
  state = {
    userData: {
      username: '',
      email: '',
      image: '',
      languages: []
    },
    langOptions: []
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

  componentDidMount() {
    const userData = this.props.location.state.userData
    this.setState({ userData })

    const langOptions = [...this.state.langOptions]

    userData.languages.forEach(language => {
      this.options.forEach(option => {
        if (option.value === language.id) {
          langOptions.push(option)
        }
      })
    })
    this.setState({ langOptions })
  }

  handleChange = ({ target }) => {
    const userData = { ...this.state.userData, [target.name]: target.value }
    this.setState({ userData })
  }


  handdleMultiChange = (selected) => {
    const languages = selected ? selected.map(item => item) : []
    const userData = { ...this.state.userData, languages }
    this.setState({ userData })

    const langOptions = []
    selected.forEach(language => {
      this.options.forEach(option => {
        if (option.value === language.value) {
          langOptions.push(option)
        }
      })
    })
    this.setState({ langOptions })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const { userData, langOptions } = this.state

    const sendData = {
      username: userData.username,
      email: userData.email,
      languages: langOptions.map(language => language.value),
      image: userData.image
    }

    try {
      await axios.put(`/api/users/${this.props.match.params.id}/`, sendData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      this.props.history.goBack()
    } catch (err) {
      console.log(err)
    }
  }


  render() {
    const { userData, langOptions } = this.state
    return (
      <div className="section">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="has-text-centered">
              <h2 className="title">Edit your Profile</h2>
            </div>
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
                    value={userData.username} />
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
                    value={userData.email} />
                </div>
              </div>

              <div className="field">
                <label className="label">Language(s)</label>
                <div className="control">
                  <Select
                    options={this.options}
                    value={langOptions}
                    isMulti
                    onChange={this.handdleMultiChange}
                  />
                </div>
              </div>

              <img className="image is-128x128" src={userData.image} alt={userData.username} />
              <ImageUpload
                name="image"
                handleChange={this.handleChange}
                fieldName="image"
                labelClassName="my-label-class"
                inputClassName="my-input-class"
              />

              <div className="has-text-centered">
                <button className="button is-warning">Save</button>
              </div>
            </form>
          </div>
        </div>

      </div >
    )
  }
}

export default ProfileEdit