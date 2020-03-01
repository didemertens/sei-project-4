import React from 'react'
import axios from 'axios'
import moment from 'moment'
import Auth from '../lib/Auth'
import { TiDelete } from "react-icons/ti"

import SunEditor from "suneditor-react"
import 'suneditor/dist/css/suneditor.min.css'
import parse from 'html-react-parser'

class Chat extends React.Component {
  state = {
    messageData: {
      text: '',
      submitted: false
    },
    currentUser: '',
    chatData: {
      owner: '',
      receiver: '',
      messages: [],
      updated_at: ''
    },
    intervalId: null
  }

  componentDidMount() {
    const currentUser = Auth.getPayload().sub
    this.setState({ currentUser })
    this.getChat()
    const intervalId = setInterval(() => this.getChat(), 30000)
    this.setState({ intervalId })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ block: "end" })
  }

  getChat = async () => {
    try {
      const { data } = await axios.get(`/api/chats/${this.props.match.params.id}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      this.setState({ chatData: data })
      const messageData = { ...this.state.messageData, submitted: false }
      this.setState({ messageData })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = ({ target: { name, value } }) => {
    const messageData = { ...this.state.messageData, [name]: value }
    this.setState({ messageData })
  }

  handleChangeEditor = (content) => {
    const messageData = { ...this.state.messageData, text: content }
    this.setState({ messageData })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/chats/${this.props.match.params.id}/messages/`, this.state.messageData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      const messageData = { ...this.state.messageData, text: '', submitted: true }
      this.setState({ messageData })
      this.getChat()
    } catch (err) {
      console.log(err)
    }
  }

  handleDeleteChat = async (e) => {
    e.preventDefault()
    try {
      await axios.delete(`/api/chats/${this.state.chatData.id}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.props.history.goBack('')
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { messageData, chatData, currentUser } = this.state
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
                  <TiDelete className="chat-delete-btn" onClick={this.handleDeleteChat} />
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
                <div ref={(el) => { this.messagesEnd = el; }}></div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column is-8 is-offset-2 chat-editor">
              <form onSubmit={this.handleSubmit} className="form">
                <SunEditor
                  setContents={messageData.submitted ? 'Type your message here' : ''}
                  onChange={this.handleChangeEditor}
                  required="True"
                  lang="en"
                  placeholder="Type your message here"
                  setOptions={{
                    height: 50,
                    buttonList: [
                      // ['undo', 'redo'],
                      ['font', 'fontSize', 'formatBlock'],
                      ['paragraphStyle'],
                      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                      ['fontColor', 'hiliteColor', 'textStyle']
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
}

export default Chat