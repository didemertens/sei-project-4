import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Auth from '../lib/Auth'
import { TiDelete } from "react-icons/ti"

import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import parse from 'html-react-parser'
const Chat = ({ match, history }) => {
  const [currentUser, setUser] = useState('')
  const [messageData, setMessageData] = useState({})
  const [chatData, setChatData] = useState({})




  // componentDidMount() {
  //   const currentUser = Auth.getPayload().sub
  //   this.setState({ currentUser })
  //   this.getChat()
  //   const intervalId = setInterval(() => this.getChat(), 30000)
  //   this.setState({ intervalId })
  // }

  // componentWillUnmount() {
  //   clearInterval(this.state.intervalId)
  // }

  // componentDidUpdate() {
  //   this.scrollToBottom()
  // }


  const messagesEnd = useRef(null)





  const getChat = async (isCancelled) => {
    try {
      if (!isCancelled) {
        const { data } = await axios.get(`/api/chats/${match.params.id}`,
          { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
        )
        setChatData(data)
        // const messageData = { ...this.state.messageData, submitted: false }
        setMessageData({ ...messageData, submitted: false })
        scrollToBottom(isCancelled)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const scrollToBottom = (isCancelled) => {
    // console.log(messagesEnd)
    if (chatData && !isCancelled) {
      messagesEnd.current.scrollIntoView({ block: "end" })

    }
  }


  // const handleChange = ({ target: { name, value } }) => {
  //   // const messageData = { ...this.state.messageData, [name]: value }
  //   setMessageData({ ...messageData, [name]: value })
  // }

  const handleChangeEditor = (content) => {
    // const messageData = { ...this.state.messageData, text: content }
    setMessageData({ messageData, text: content })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/chats/${match.params.id}/messages/`, messageData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      // const messageData = { ...this.state.messageData, text: '', submitted: true }
      setMessageData({ ...messageData, text: '', submitted: true })
      getChat()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteChat = async (e) => {
    e.preventDefault()
    try {
      await axios.delete(`/api/chats/${chatData.id}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      history.goBack('')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    let isCancelled = false
    const currentUser = Auth.getPayload().sub
    setUser(currentUser)
    getChat(isCancelled)
  }, [getChat])

  useEffect((isCancelled) => {
    return () => {
      isCancelled = true
      console.log("cleaned up")
    }
  }, [])



  if (!chatData.hasOwnProperty('id')) {
    return null
  }

  return (
    <div className="section chat-whole-section">
      <div>
        <div className="columns">
          <div className="column is-8 is-offset-2 ">
            <div className="chat-header">
              <h2 className="title">{chatData.owner.id === currentUser ? `Chat with ${chatData.receiver.username}`
                : `Chat with ${chatData.owner.username}`}
              </h2>
              {chatData.owner.id === currentUser || chatData.receiver.id === currentUser
                ?
                <div className="delete-chat">
                  <TiDelete className="chat-delete-btn" onClick={handleDeleteChat} />
                  <p className="is-size-7 chat-delete-text">Delete chat</p>
                </div>
                :
                null}
            </div>
            <div className="chat-section">
              {chatData && chatData.messages.map(message => {
                return (
                  <div className={message.owner.id === currentUser
                    ?
                    `box chat-box has-text-right chat-text-owner`
                    :
                    `box chat-box has-text-left chat-text-receiver`}
                    key={message.id} >
                    <p className="is-size-7">{moment(message.created_at).calendar()}</p>
                    <div>{parse(message.text)}</div>
                  </div>
                )
              })
              }
              <div ref={messagesEnd}></div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-8 is-offset-2 chat-editor">
            <form onSubmit={handleSubmit} className="form">
              <SunEditor
                setContents={messageData.submitted ? 'Type your message here' : ''}
                onChange={handleChangeEditor}
                required="True"
                lang="en"
                placeholder="Type your message here"
                setOptions={{
                  height: 50,
                  buttonList: [
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor']
                  ]
                }}
              />
              <button className="button is-warning">Send</button>
            </form>
          </div>
        </div >
      </div >
    </div >
  )



}