import React from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../lib/Auth'

class Profile extends React.Component {
  state = {
    currentUser: '',
    userData: {
      'id': '',
      username: '',
      email: '',
      image: '',
      buddy: {},
      languages: [],
      chats_from: [],
      chats_with: []
    }
  }

  getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${this.props.match.params.id}`)
      this.setState({ userData: data })
    }
    catch (err) {
      console.log(err)
    }
  }

  handleClick = (chatId) => {
    this.props.history.push(`/chats/${chatId}`)
  }

  handleNewChat = async () => {
    const currentUser = Auth.getPayload().sub
    const { chats_from, chats_with } = this.state.userData
    let existChat = false

    chats_from.forEach(chat => {
      if (chat.receiver.id === currentUser) {
        this.props.history.push(`/chats/${chat.id}`)
        existChat = true
      }
    })

    chats_with.forEach(chat => {
      if (chat.owner.id === currentUser) {
        this.props.history.push(`/chats/${chat.id}`)
        existChat = true
      }
    })

    if (!existChat) {
      try {
        const receiver = { receiver: this.state.userData.id }
        const { data } = await axios.post(`/api/chats/`, receiver,
          { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
        this.props.history.push(`/chats/${data.id}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  componentDidMount() {
    const currentUser = Auth.getPayload().sub
    this.setState({ currentUser })
    this.getUserData()
  }

  componentDidUpdate(prevProps) {
    const locationChanged =
      this.props.location !== prevProps.location;
    if (locationChanged) {
      this.getUserData()
    }
  }

  render() {
    const { userData, currentUser } = this.state
    const buddyLang = userData.buddy.languages
    let buddyLangArr = []
    if (buddyLang) {
      buddyLangArr = Object.values(buddyLang)
    }
    return (
      <div className="section">
        <h1 className="title">Profile</h1>
        <img src={userData.image} alt={userData.username} />
        <p>Username: {userData.username}</p>
        {userData.languages.length > 1 ?
          <p>Languages:</p>
          :
          <p>Language:</p>
        }
        {userData.languages.map(language => {
          return (
            <p key={language.id}>{language.name}</p>
          )
        })}
        {currentUser === userData.id
          ?
          <p>Email: {userData.email}</p>
          :
          null
        }

        {currentUser !== userData.id
          ?
          <button className="button" onClick={this.handleNewChat}>Chat</button>
          :
          null
        }

        {/* buddy */}
        <h1 className="title">Buddy</h1>
        <p>Username:  <Link to={`/profile/${userData.buddy.id}`}>{userData.buddy.username}</Link></p>
        <img src={userData.buddy.image} alt={userData.buddy.username} />
        {buddyLangArr.length > 1 ?
          <p>Languages:</p>
          :
          <p>Language:</p>
        }
        {buddyLangArr.map(language => {
          return (
            <p key={language.id}>{language.name}</p>
          )
        })}

        {/* chats */}
        {currentUser === userData.id
          ?
          <div>
            <h1 className="title">My chats:</h1>
            {userData.chats_from.map(chat => {
              return (
                <div key={chat.id}>
                  <p>{chat.receiver.username}</p>
                  <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                </div>
              )
            })}
            {userData.chats_with.map(chat => {
              return (
                <div key={chat.id}>
                  <p>{chat.owner.username}</p>
                  <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                </div>
              )
            })}
          </div>
          :
          null
        }
      </div>
    )
  }
}

export default withRouter(Profile)