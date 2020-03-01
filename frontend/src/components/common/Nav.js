import React from 'react'
import Auth from '../lib/Auth'
import axios from 'axios'
import { TiBell } from "react-icons/ti"
import { withRouter, Link } from 'react-router-dom'

class Nav extends React.Component {

  state = {
    unseenChat: ''
  }

  componentDidMount() {
    if (Auth.isAuthenticated()) {
      this.getUserData()
      setInterval(this.getUserData, 4000)
    }
  }

  getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${Auth.getPayload().sub}/chats/`)
      this.setState({ unseenChat: data })
    }
    catch (err) {
      console.log(err)
    }
  }

  handleLogout = () => {
    Auth.logout()
    this.props.history.push('/')
  }

  render() {
    const userId = Auth.getPayload()
    return (
      <nav className="navbar is-white is-fixed-top">
        <div className="navbar-menu">
          <div className="navbar-brand">
            <Link id="navbar-item" to="/" className="navbar-item">Home</Link>
          </div>
          <div className="navbar-end">
            {!Auth.isAuthenticated() &&
              <>
                <Link id="navbar-item" to="/register" className="navbar-item">Sign up</Link>
                <Link id="navbar-profile" to="/login" className="navbar-item">Log in</Link>
              </>}

            {this.state.unseenChat
              ?
              Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}`} id="navbar-profile" className="navbar-item">Profile <TiBell /></Link>
              :
              Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}`} id="navbar-profile" className="navbar-item">Profile <TiBell className="is-hidden" /></Link>
            }

            {/* {Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}/`} className="navbar-item">Profile</Link>} */}
            {Auth.isAuthenticated() && <a href="/" className="navbar-item" id="navbar-item" onClick={this.handleLogout}>Logout</a>}
          </div>
        </div>
      </nav >
    )
  }
}

export default withRouter(Nav)