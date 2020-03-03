import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import { TiBell } from "react-icons/ti"
import Auth from '../lib/Auth'
import Moment from 'moment'
import { TiArrowRightThick } from "react-icons/ti"

const Profile = ({ location, match, history }) => {
  const [currentUser, setCurrentUser] = useState('')
  const [userData, setUserData] = useState({})
  const [buddyLang, setBuddyLang] = useState([])
  const [messages_with, setMessagesWith] = useState({})
  const [messages_from, setMessagesFrom] = useState({})
  const [newMessage, setNewMessage] = useState(false)

  // const memoizedCallback = useCallback(
  //   () => {
  //     doSomething(a, b);
  //   },
  //   [a, b],
  // );

  // async () => {
  //   try {
  //     const { data } = await axios.get(`/api/users/${match.params.id}/`,
  //       { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
  //     checkMessagesChats(data)
  //     orderQuestions(data)
  //     buddyLanguages(data)
  //     setUserData(data)
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // }

  const buddyLanguages = (data) => {
    const buddy = data.buddy
    let buddyLangArr = []
    if (buddy) {
      const buddyLang = buddy.languages
      if (buddyLang) {
        buddyLangArr = Object.values(buddyLang)
      }
    }
    setBuddyLang(buddyLangArr)
  }

  const orderQuestions = (data) => {
    const questions = data.questions
    const sortedQuestions = questions.sort((a, b) => {
      return new Moment(b.created_at).format('YYYYMMDDHHmmss') - new Moment(a.created_at).format('YYYYMMDDHHmmss')
    })
    setUserData({ ...data, questions: sortedQuestions })
  }



  const handleClick = (chatId) => history.push(`/chats/${chatId}`)

  const handleNewChat = async () => {
    const currentUser = Auth.getPayload().sub
    const { chats_from, chats_with } = userData
    let existChat = false

    chats_from.forEach(chat => {
      if (chat.receiver.id === currentUser) {
        history.push(`/chats/${chat.id}`)
        existChat = true
      }
    })

    chats_with.forEach(chat => {
      if (chat.owner.id === currentUser) {
        history.push(`/chats/${chat.id}`)
        existChat = true
      }
    })

    if (!existChat) {
      try {
        const receiver = { receiver: userData.id }
        const { data } = await axios.post(`/api/chats/`, receiver,
          { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
        history.push(`/chats/${data.id}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  let isCancelled = false;

  const getUserData = useCallback(
    async () => {
      try {
        if (!isCancelled) {
          const { data } = await axios.get(`/api/users/${match.params.id}/`,
            { headers: { Authorization: `Bearer ${Auth.getToken()}` } })

          const checkMessagesChats = (data) => {
            data.chats_with.forEach(chat => {
              chat.notifications.forEach(notification => {
                if (notification.receiver === currentUser) {
                  setMessagesWith({ ...messages_with, chat: chat.id })
                  setNewMessage(true)
                }
              })
            })

            data.chats_from.forEach(chat => {
              chat.notifications.forEach(notification => {
                if (notification.receiver === currentUser) {
                  setMessagesFrom({ ...messages_from, chat: chat.id })
                  setNewMessage(true)
                }
              })
            })
          }
          checkMessagesChats(data)
          orderQuestions(data)
          buddyLanguages(data)
          setUserData(data)
        } else {
          return
        }

      }
      catch (err) {
        console.log(err)
      }
    }, [match.params.id, messages_from, messages_with, currentUser]
  )

  useEffect(() => {
    const currentUser = Auth.getPayload().sub
    setCurrentUser(currentUser)
    getUserData()
  }, [location])

  useEffect(() => {
    getUserData()
    console.log('get user data')
  }, [getUserData])

  useEffect(() => {
    return () => {
      isCancelled = true
      console.log("cleaned up")
    };
  }, [])

  if (!userData.hasOwnProperty('id')) {
    return null
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
                <button className="button is-warning" onClick={handleNewChat}>Chat</button>
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
                      {buddyLang.length > 1 ?
                        <p>Languages:</p>
                        :
                        <p>Language:</p>
                      }
                      {buddyLang.map(language => {
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
                            <button className="button is-warning" onClick={() => handleClick(chat.id)}>Chat <TiBell /></button>

                          </div>
                          :
                          <div className="column">
                            <button className="button is-warning" onClick={() => handleClick(chat.id)}>Chat</button>
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
                            <button className="button is-warning" onClick={() => handleClick(chat.id)}>Chat <TiBell /></button>
                          </div>
                          :
                          <div className="column">
                            <button className="button is-warning" onClick={() => handleClick(chat.id)}>Chat</button>
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