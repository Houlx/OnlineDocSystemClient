import React, { Component } from 'react'
import { getCurrentUser } from './util/ApiUtils';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import { notification } from 'antd';
import { ACCESS_TOKEN } from './constants';
import IndexPage from './pages/landing'
import PrivateRoute from './common/PrivateRoute';
import Signup from './pages/signup/Signup';
import NotFound from './common/NotFound';

class App extends Component {
  state = {
    currentUser: null,
    authenticated: localStorage.getItem(ACCESS_TOKEN),
    loading: false
  }

  loadCurrentUser = () => {
    this.setState({ loading: true })
    getCurrentUser().then(res => {
      console.log(res.data)
      this.setState({
        currentUser: res.data,
        authenticated: true,
        loading: false
      })
      console.log(this.state.currentUser)
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false })
    })
  }

  handleLogin = () => {
    this.loadCurrentUser()
    this.props.history.push('/')
    notification.success({
      message: "Login Successful",
      description: "Successfully logged in"
    })
  }

  handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    console.log()
    this.setState({
      currentUser: null,
      authenticated: false
    })

    this.props.history.push('/')

    notification.success({
      message: 'Logged Out',
      description: 'Successfully logged out'
    })
  }

  componentDidMount() {
    this.loadCurrentUser()
  }

  render() {
    return (
      <Switch>
        <Route
          exact path='/'
          render={(props) =>
            this.state.authenticated && this.state.currentUser ?
              <Redirect to={'/files/' + this.state.currentUser.id} {...props} /> : <IndexPage {...props} />
          }
        />
        <PrivateRoute path='/files/:id' component={Home} authenticated={this.state.authenticated} onLogout={this.handleLogout} currentUser={this.state.currentUser} onLoadUser={this.loadCurrentUser} />
        <Route path='/login' render={(props) => <Login onLogin={this.handleLogin} {...props} />} />
        <Route path='/signup' component={Signup} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(App)