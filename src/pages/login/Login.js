import React from 'react'
import {
  Form, Icon, Input, Button, notification,
} from 'antd';
import './Login.css'
import { login } from '../../util/ApiUtils';
import { ACCESS_TOKEN } from '../../constants';
import { Link } from 'react-router-dom/cjs/react-router-dom';

class NormalLoginForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const loginRequest = Object.assign({}, values)
        login(loginRequest).then(res => {
          if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.accessToken)
            this.props.onLogin()
            console.log(this.props)
            this.props.history.push('/')
          }
        }).catch(err => {
          if (err.response.status === 401) {
            notification.error({
              message: "Login Failed",
              description: "Invalid Account Or Password"
            })
          } else {
            notification.error({
              message: "Login Failed",
              description: "Unknown Error"
            })
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="login-container">
        <h1 className="page-title">Login</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('usernameOrEmail', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" size='large' />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size='large' placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )} */}
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to='/signup'>register now!</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default WrappedNormalLoginForm