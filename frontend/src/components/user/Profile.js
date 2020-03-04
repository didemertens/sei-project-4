import React from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import { TiBell } from "react-icons/ti"
import Auth from '../lib/Auth'
import Moment from 'moment'
import { TiArrowRightThick } from "react-icons/ti"

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
      chats_with: [],
      questions: []
    },
    messages_with: {},
    messages_from: {},
    newMessage: false
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

  getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${this.props.match.params.id}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      this.setState({ userData: data })
      this.checkMessagesChats(data)
      this.orderQuestions(data.questions)
    }
    catch (err) {
      console.log(err)
    }
  }

  orderQuestions = (questions) => {
    const sortedQuestions = questions.sort((a, b) => {
      return new Moment(b.created_at).format('YYYYMMDDHHmmss') - new Moment(a.created_at).format('YYYYMMDDHHmmss')
    })
    const userData = { ...this.state.userData, questions: sortedQuestions }
    this.setState({ userData })
  }

  checkMessagesChats = (data) => {
    data.chats_with.forEach(chat => {
      chat.notifications.forEach(notification => {
        if (notification.receiver === this.state.currentUser) {
          const messages_with = { ...this.state.messages_with, chat: chat.id }
          this.setState({ messages_with, newMessage: true })
        }
      })
    })

    data.chats_from.forEach(chat => {
      chat.notifications.forEach(notification => {
        if (notification.receiver === this.state.currentUser) {
          const messages_from = { ...this.state.messages_from, chat: chat.id }
          this.setState({ messages_from, newMessage: true })
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

  render() {
    const { userData, currentUser, messages_with, messages_from, newMessage } = this.state
    let buddyLangArr = []
    if (userData.buddy) {
      const buddyLang = userData.buddy.languages
      if (buddyLang) {
        buddyLangArr = Object.values(buddyLang)
      }
    }
    return (
      <section className="section profile-section" >
        <div className="columns">
          <div className="column is-4 profile-fixed-column">
            {currentUser === userData.id ?
              <h2><a href="#profile-user" className="title is-size-6-mobile">You</a></h2>
              :
              <h2><a href="#profile-user" className="title is-size-6-mobile">User</a></h2>
            }
            <h2><a href="#profile-buddy" className="title is-size-6-mobile">Buddy</a></h2>
            {currentUser === userData.id && newMessage
              ?
              <h2><a href="#profile-chats" className="title is-size-6-mobile">Chats <TiBell /> </a></h2>
              :
              currentUser === userData.id && <h2><a href="#profile-chats" className="title is-size-6-mobile">Chats</a></h2>
            }
            <h2><a href="#profile-questions" className="title is-size-6-mobile">Questions</a></h2>
          </div>

          <div className="column is-7 profile-column-right">
            {/* user */}
            <div id="profile-user">
              <div className="profile-user-top"></div>
              <div className="box">
                <div className="columns">
                  <div className="column is-4 is-offset-1">
                    <img className="image is-128x128" src={userData.image} alt={userData.username} />
                  </div>
                  <div className="column">
                    <p>Username: {userData.username}</p>
                    {userData.languages.length > 1 ?
                      <p>Languages:</p>
                      :
                      <p>Language:</p>
                    }
                    {userData.languages.map(language => {
                      return (
                        <div className="profile-user-languages" key={language.id}>
                          <img className="image is-24x24" src={language.image} alt="" />
                          <p>{language.name}</p>
                        </div>
                      )
                    })}
                    {currentUser === userData.id
                      ?
                      <p>Email: {userData.email}</p>
                      :
                      null
                    }
                  </div>
                </div>
                {currentUser !== userData.id
                  ?
                  <button className="button is-warning" onClick={this.handleNewChat}>Chat</button>
                  :
                  null
                }
                {currentUser === userData.id ?
                  <Link
                    to={{
                      pathname: `/profile/${userData.id}/edit/`,
                      state: {
                        userData: userData
                      }
                    }}
                    className=" button is-warning">Change profile
                </Link>
                  :
                  null
                }
              </div>
            </div>
            {/* buddy */}
            <div id="profile-buddy">
              <div className="profile-buddy-top"></div>
              <div className="box">
                <div className="columns">
                  {userData.buddy
                    ?
                    <>
                      <div className="column is-4 is-offset-1">
                        <img className="image is-128x128" src={userData.buddy.image} alt={userData.buddy.username} />
                      </div>
                      <div className="column">
                        <p>Username:  <Link to={`/profile/${userData.buddy.id}`}>{userData.buddy.username}</Link></p>
                        {buddyLangArr.length > 1 ?
                          <p>Languages:</p>
                          :
                          <p>Language:</p>
                        }
                        {buddyLangArr.map(language => {
                          return (
                            <div className="profile-buddy-languages" key={language.id}>
                              <img className="image is-24x24" src={language.image} alt={language.name} />
                              <p>{language.name}</p>
                            </div>
                          )
                        })}
                      </div>
                    </>
                    :
                    <h2 className="is-size-5">Come back soon to meet your buddy!</h2>
                  }
                </div>
              </div>
            </div>
            {/* chats */}
            {currentUser === userData.id && (userData.chats_from.length > 0 || userData.chats_with.length > 0)
              ?
              < div id="profile-chats">
                <div className="profile-chats-top"></div>
                < div className="box">
                  <>
                    {userData.chats_from.map(chat => {
                      return (
                        <div key={chat.id} className="columns">
                          <div className="column">
                            <Link to={`/profile/${chat.receiver.id}`}>{chat.receiver.username}</Link>
                            <p className="is-size-7">Last message: {Moment(chat.updated_at).calendar()}</p>
                          </div>
                          {messages_from.chat === chat.id
                            ?
                            <div className="column">
                              <button className="button is-warning" onClick={() => this.handleClick(chat.id)}>Chat</button>
                              <TiBell />
                            </div>
                            :
                            <div className="column">
                              <button className="button is-warning" onClick={() => this.handleClick(chat.id)}>Chat</button>
                            </div>
                          }
                        </div>
                      )
                    })}
                    {userData.chats_with.map(chat => {
                      return (
                        <div key={chat.id} className="columns">
                          <div className="column">
                            <Link to={`/profile/${chat.owner.id}`}>{chat.owner.username}</Link>
                            <p className="is-size-7">Last message: {Moment(chat.updated_at).calendar()}</p>
                          </div>
                          {messages_with.chat === chat.id
                            ?
                            <div className="column">
                              <button className="button is-warning" onClick={() => this.handleClick(chat.id)}>Chat</button>
                              <TiBell />
                            </div>
                            :
                            <div className="column">
                              <button className="button is-warning" onClick={() => this.handleClick(chat.id)}>Chat</button>
                            </div>
                          }
                        </div>
                      )
                    })}
                  </>
                </div>
              </div>
              :
              null
            }
            {currentUser === userData.id && (!userData.chats_from.length && !userData.chats_with.length) ?
              < div id="profile-chats">
                <div className="profile-chats-top">
                  < div className="box">
                    <p>No chats yet</p>
                  </ div>
                </ div>
              </div>
              : null
            }
            {/* questions */}
            {userData.questions.length > 0
              ?
              <div id="profile-questions">
                <div className="profile-questions-top"></div>
                <div className="box">
                  {userData.questions.map(question => {
                    return (
                      <div className="profile-question-box" key={question.id}>
                        <Link to={`/questions/${question.id}`}><div className="question-title">< TiArrowRightThick className="question-arrow"></TiArrowRightThick> {question.title}</div></Link>
                        <p className="subtitle is-size-7">{Moment(question.created_at).calendar()}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              :
              <div id="profile-questions">
                <div className="profile-questions-top"></div>
                <div className="box">
                  <p>No questions yet</p>
                </div>
              </div>
            }
          </div>
        </div >
      </section >
    )
  }
}

export default withRouter(Profile)