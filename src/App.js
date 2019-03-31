import React, { Component } from 'react'
import { getCurrentUser } from './util/ApiUtils';
import { Route, Switch, withRouter } from 'react-router-dom';
import Login from './user/login/Login';
import { Home } from './Home';
import { notification } from 'antd';
import { ACCESS_TOKEN } from './constants';
import IndexPage from './IndexPage'
import PrivateRoute from './common/PrivateRoute';
import Signup from './user/signup/Signup';

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
        <Route exact path='/' render={() => <IndexPage authenticated={this.state.authenticated} />} />
        <PrivateRoute path='/home' component={Home} authenticated={this.state.authenticated} onLogout={this.handleLogout} />
        <Route path='/login' render={(props) => <Login onLogin={this.handleLogin} {...props} />} />
        <Route path='/signup' component={Signup} />
      </Switch>
    )
  }
}

export default withRouter(App)