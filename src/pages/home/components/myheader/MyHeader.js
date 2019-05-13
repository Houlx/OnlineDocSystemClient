import React from 'react'
import { Layout, Icon, Upload, Button, Menu, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { API_BASE_URL, ACCESS_TOKEN } from '../../../../constants'
import './MyHeader.css'

const { Header } = Layout


class MyHeader extends React.Component {

  handleMenuClick = ({ key }) => {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

  render() {
    const props = {
      name: 'file',
      action: API_BASE_URL + '/files',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
      },
      showUploadList: false,
    }
    const menuItems = [
      <Menu.Item key='/profile' className='profile-menu'>
        <ProfileDropdownMenu
          currentUser={this.props.currentUser}
          handleMenuClick={this.handleMenuClick} />
      </Menu.Item>,
    ]
    console.log(this.props.currentUser)
    return (
      <Header className='my-header'>
        <div className='container'>
          <div className='header-title'>
            <Icon
              className="trigger"
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.props.onToggle}
            />
            <Upload {...props} onChange={this.props.onChange}>
              <Button>
                <Icon type="upload" />
                Upload
            </Button>
            </Upload>
          </div>
          <Menu
            className='header-menu'
            mode='horizontal'
            style={{ lineHeight: '64px' }} >
            {menuItems}
          </Menu>
        </div>
        {/* <Button onClick={this.props.onLogout}>Logout</Button> */}
      </Header>
    )
  }
}

const ProfileDropdownMenu = (props) => {
  const dropDownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser ? props.currentUser.name : null}
        </div>
        <div className="username-info">
          @{props.currentUser ? props.currentUser.username : null}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  )
  console.log(props.currentUser)

  return (
    <Dropdown
      overlay={dropDownMenu}
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}
    >
      <Link className="ant-dropdown-link">
        <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} /> <Icon type="down" />
      </Link>
    </Dropdown>
  )
}

export default withRouter(MyHeader)