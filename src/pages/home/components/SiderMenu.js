import React from 'react'
import { Menu, Icon } from 'antd'
import { FileType } from '../../../constants'

export default props => (
  <Menu theme="light" mode="inline" defaultSelectedKeys={['0']} onClick={props.onClick}>
    <Menu.Item key='0'>
      <Icon type="file" />
      <span>All</span>
    </Menu.Item>
    <Menu.Item key={FileType.TXT}>
      <Icon type="file-text" />
      <span>TXT</span>
    </Menu.Item>
    <Menu.Item key={FileType.DOC}>
      <Icon type="file-word" />
      <span>Word</span>
    </Menu.Item>
    <Menu.Item key={FileType.PPT}>
      <Icon type="file-ppt" />
      <span>PowerPoint</span>
    </Menu.Item>
    <Menu.Item key={FileType.XLS}>
      <Icon type="file-excel" />
      <span>Excel</span>
    </Menu.Item>
    <Menu.Item key={FileType.PDF}>
      <Icon type="file-pdf" />
      <span>PDF</span>
    </Menu.Item>
    <Menu.Item key={FileType.OTHER}>
      <Icon type="file-unknown" />
      <span>Others</span>
    </Menu.Item>
  </Menu>
)