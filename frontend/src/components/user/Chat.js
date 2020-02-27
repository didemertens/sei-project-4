import React from 'react'
import axios from 'axios'

import Auth from '../lib/Auth'

class Chat extends React.Component {
  state = {
    messageData: {
      text: '',
    },
    currentUser: '',
    chatData: {
      owner: '',
      receiver: '',
      messages: []
    }
  }

  getChat = async () => {
    try {
      const { data } = await axios.get(`/api/chats/${this.props.match.params.id}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      this.setState({ chatData: data })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = ({ target: { name, value } }) => {
    const messageData = { ...this.state.messageData, [name]: value }
    this.setState({ messageData })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/chats/${this.props.match.params.id}/messages/`, this.state.messageData,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
      )
      const messageData = { ...this.state.messageData, text: '' }
      this.setState({ messageData })
      this.getChat()
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    const currentUser = Auth.getPayload().sub
    this.setState({ currentUser })
    this.getChat()
  }

  render() {
    const { messageData, chatData, currentUser } = this.state
    return (
      <div className="section">
        <h1 className="title">{chatData.owner.id === currentUser ? `Chat with ${chatData.receiver.username}`
          : `Chat with ${chatData.owner.username}`}
        </h1>
        {chatData.messages.map(message => {
          return (
            <div className={message.owner === currentUser ? `box has-text-right` : `box has-text-left`
            } key={message.id} >
              <p>{message.text}</p>
            </div>
          )
        })
        }
        <form onSubmit={this.handleSubmit} className="form">
          <div className="field">
            <div className="control">
              <input
                required="True"
                className="input"
                type="text"
                placeholder="Type a message"
                name="text"
                onChange={this.handleChange}
                value={messageData.text} />
            </div>
          </div>
          <button className="button">Send</button>
        </form>
      </div >
    )
  }
}

export default Chat