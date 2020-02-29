import React from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import { TiBell } from "react-icons/ti"
import Auth from '../lib/Auth'


class Profile extends React.Component {
  state = {
    currentUser: '',
    userData: {
      id: '',
      username: '',
      email: '',
      image: '',
      buddy: {},
      languages: [],
      chats_from: [],
      chats_with: []
    },
    messages_with: {},
    messages_from: {}
  }

  getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${this.props.match.params.id}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      this.setState({ userData: data })
      this.checkMessagesChats(data)
    }
    catch (err) {
      console.log(err)
    }
  }

  checkMessagesChats = (data) => {
    data.chats_with.forEach(chat => {
      chat.notifications.forEach(notification => {
        if (notification.receiver === this.state.currentUser) {
          const messages_with = { ...this.state.messages_with, chat: chat.id }
          this.setState({ messages_with })
        }
      })
    })

    data.chats_from.forEach(chat => {
      chat.notifications.forEach(notification => {
        if (notification.receiver === this.state.currentUser) {
          const messages_from = { ...this.state.messages_from, chat: chat.id }
          this.setState({ messages_from })
        }
      })
    })
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
    const { userData, currentUser, messages_with, messages_from } = this.state
    let buddyLangArr = []
    if (userData.buddy) {
      const buddyLang = userData.buddy.languages
      if (buddyLang) {
        buddyLangArr = Object.values(buddyLang)
      }
    }
    return (
      <div className="section">

        <div className="columns is-multiline">
          <div className="column is-2">
            <h2 className="title">Profile</h2>
          </div>
          <div className="column is-4">
            {currentUser === userData.id ?
              <Link
                to={{
                  pathname: `/profile/${userData.id}/edit/`,
                  state: {
                    userData: userData
                  }
                }}
                className="button">Change profile info
          </Link>
              :
              null
            }
            <img className="image is-128x128" src={userData.image} alt={userData.username} />

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
          </div>

          <div className="column is-2">
            <h2 className="title">Chats</h2>
          </div>

          <div className="column is-4">
            {/* chats */}
            {currentUser === userData.id && (userData.chats_from.length > 0 || userData.chats_with.length > 0)
              ?
              <div>

                {userData.chats_from.map(chat => {
                  return (
                    <div key={chat.id}>
                      <Link to={`/profile/${chat.receiver.id}`}>{chat.receiver.username}</Link>

                      {messages_from.chat === chat.id
                        ?
                        <>
                          <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                          <TiBell />
                        </>
                        :
                        <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                      }
                    </div>
                  )
                })}
                {userData.chats_with.map(chat => {
                  return (
                    <div key={chat.id}>
                      <Link to={`/profile/${chat.owner.id}`}>{chat.owner.username}</Link>
                      {messages_with.chat === chat.id
                        ?
                        <>
                          <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                          <TiBell />
                        </>
                        :
                        <button className="button" onClick={() => this.handleClick(chat.id)}>Chat</button>
                      }
                    </div>
                  )
                })}
              </div>
              :
              null
            }
          </div>
          <div className="column is-2">
            <h2 className="title">Buddy</h2>
          </div>
          <div className="column is-4">
            {/* buddy */}
            {userData.buddy
              ?
              <>
                <p>Username:  <Link to={`/profile/${userData.buddy.id}`}>{userData.buddy.username}</Link></p>
                <img className="image is-128x128" src={userData.buddy.image} alt={userData.buddy.username} />
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
              </>
              :
              <h2 className="is-size-5">Come back soon to meet your buddy!</h2>
            }
          </div>


        </div>












      </div>
    )
  }
}

export default withRouter(Profile)