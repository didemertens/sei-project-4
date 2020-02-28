import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import 'bulma'
import './styles/main.scss'

import Home from './components/Home'
import Nav from './components/common/Nav'

import Index from './components/Index'
import Detail from './components/Detail'
import NewQuestion from './components/NewQuestion'

import Register from './components/user/Register'
import Login from './components/user/Login'
import Profile from './components/user/Profile'
import ProfileEdit from './components/user/ProfileEdit'
import Chat from './components/user/Chat'

function App() {
  return (
    <Router>
      <main>
        <Nav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/questions/new" component={NewQuestion} />
          <Route path="/questions/:id" component={Detail} />
          <Route path="/questions" component={Index} />
          <Route path="/profile/:id/edit" component={ProfileEdit} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/chats/:id" component={Chat} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
