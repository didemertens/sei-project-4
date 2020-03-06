import React from 'react'
import Auth from '../lib/Auth'
import axios from 'axios'
import { TiBell } from "react-icons/ti"
import { withRouter, Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

class Nav extends React.Component {

  state = {
    unseenChat: '',
    navbarOpen: false
  }

  componentDidMount() {
    if (Auth.isAuthenticated()) {
      this.getUserData()
      setInterval(this.getUserData, 4000)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ navbarOpen: false })
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

  toggleNav = () => {
    this.setState({ navbarOpen: !this.state.navbarOpen })
  }

  render() {
    const userId = Auth.getPayload()
    const { navbarOpen } = this.state
    return (
      <nav className="navbar is-white is-fixed-top">
        <div className="navbar-brand">
          <Link id="navbar-item" to="/" className="navbar-item">
            <img className="image is-24x24 nav-image" src={logo} alt="Git Together logo" />
            Git Together
          </Link>
          <Link to='#' onClick={this.toggleNav} role="button" id='navbar-burger' className={`navbar-burger ${navbarOpen ? 'is-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </Link>
        </div>
        <div className={`navbar-menu ${navbarOpen ? 'is-active' : ''}`} id='navbar-menu'>
          <div className="navbar-end">
            {!Auth.isAuthenticated() &&
              <>
                <Link id="navbar-item" to="/register" className="navbar-item">Sign up</Link>
                <Link id="navbar-profile" to="/login" className="navbar-item">Log in</Link>
              </>
            }

            {this.state.unseenChat
              ?
              Auth.isAuthenticated() &&
                navbarOpen ?
                <Link to={`/profile/${userId.sub}`} id="navbar-profile" className="navbar-item">Profile <TiBell /></Link>
                :
                <>
                  <Link to={`/profile/${userId.sub}`} id="navbar-profile" className="navbar-item">Profile</Link>
                  <TiBell className="tibell-nav" />
                </>
              :
              Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}`} id="navbar-profile" className="navbar-item">Profile</Link>
            }
            {Auth.isAuthenticated() && <a href="/" className="navbar-item" id="navbar-item" onClick={this.handleLogout}>Logout</a>}
          </div>
        </div>
      </nav >
    )
  }
}


export default withRouter(Nav)