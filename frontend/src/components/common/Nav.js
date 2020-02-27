import React from 'react'
import Auth from '../lib/Auth'
import { withRouter, Link } from 'react-router-dom'

class Nav extends React.Component {

  handleLogout = () => {
    Auth.logout()
    this.props.history.push('/')
  }

  render() {
    const userId = Auth.getPayload()
    return (
      <nav className="navbar is-dark">
        <div className="navbar-menu">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">Home</Link>
          </div>
          <div className="navbar-end">
            {!Auth.isAuthenticated() &&
              <>
                <Link to="/register" className="navbar-item">Register</Link>
                <Link to="/login" className="navbar-item">Login</Link>
              </>}
            {Auth.isAuthenticated() && <Link to={`/profile/${userId.sub}/`} className="navbar-item">Profile</Link>}
            {Auth.isAuthenticated() && <a href="/" className="navbar-item" onClick={this.handleLogout}>Logout</a>}
          </div>
        </div>
      </nav >
    )
  }
}

export default withRouter(Nav)