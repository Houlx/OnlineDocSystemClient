import React from 'react'
import logo from '../../../assets/logoblue.png'

export default (props) => (
  <div className="logo" >
    <img src={logo} alt="Logo" height='32px' />
    {!props.display ? <span style={{ padding: 8 }}>在线文档管理系统</span> : null}
  </div>
)