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
      console.log(data)
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
      <nav className="navbar is-primary is-fixed">
        <div className="navbar-menu">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">Home</Link>
          </div>
          <div className="navbar-end">
            {!Auth.isAuthenticated() &&
              <>
                <Link to="/register" className="navbar-item">Sign up</Link>
                <Link to="/login" className="navbar-item">Log in</Link>
              </>}

            {this.state.unseenChat
              ?
              Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}/`} className="navbar-item">Profile <TiBell /></Link>
              :
              Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}/`} className="navbar-item">Profile</Link>
            }

            {/* {Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}/`} className="navbar-item">Profile</Link>} */}
            {Auth.isAuthenticated() && <a href="/" className="navbar-item" onClick={this.handleLogout}>Logout</a>}
          </div>
        </div>
      </nav >
    )
  }
}

export default withRouter(Nav)