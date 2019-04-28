import React from 'react'
import { Layout, Icon, Upload, Button } from 'antd';

const { Header } = Layout


export default (props) => {
  return (
    <Header style={{ background: '#fff', padding: 0 }}>
      <Icon
        className="trigger"
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={props.onToggle}
      />
      <Upload {...props.uploadProps} onChange={props.onChange}>
        <Button>
          <Icon type="upload" />
          Upload
        </Button>
      </Upload>
      <Button onClick={props.onLogout}>Logout</Button>
    </Header>
  )
}