import React, { Component } from 'react'
import { FILE_LIST_SIZE, API_BASE_URL, ACCESS_TOKEN, PREVIEW_SERVICE_URL, FILE_RESOURCE_URL } from '../../constants';
import { getUserFiles, downloadFile, deleteFile, } from '../../util/ApiUtils';
import {
  Button, Icon, message, Layout, Menu, Table, Divider,
} from 'antd';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './Home.css'
import { fileSizeFormat } from '../../util/FileUtil';
import Logo from './components/Logo'
import MyHeader from './components/MyHeader'
import { FileType } from "../../constants";
import { withRouter } from "react-router-dom";

const { Sider, Content } = Layout

class Home extends Component {
  state = {
    files: [],
    loading: false,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    collapsed: false,
  }

  handlePreview = item => {
    if (item.type === FileType.PDF) {
      window.open(FILE_RESOURCE_URL + item.createdBy + '/' + item.name, '_blank').focus()
      // window.location.href = FILE_RESOURCE_URL + item.createdBy + '/' + item.name
    } else {
      window.open(PREVIEW_SERVICE_URL + FILE_RESOURCE_URL + item.createdBy + '/' + item.name, '_blank').focus()
      // window.location.href = PREVIEW_SERVICE_URL + FILE_RESOURCE_URL + item.createdBy + '/' + item.name
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  loadFileList = (page = 0, size = FILE_LIST_SIZE) => {
    let promise = getUserFiles(page, size)
    if (!promise) {
      return
    }

    this.setState({
      files: [],
      loading: true
    })

    promise.then(res => {
      console.log(res.data)
      const files = this.state.files.slice()

      this.setState({
        loading: false,
        files: files.concat(res.data.content),
        page: res.data.page,
        size: res.data.size,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        last: res.data.last
      })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  handleDownload = (id, name) => {
    downloadFile(id, name)
  }

  handleDelete = id => {
    deleteFile(id).then(res => {
      this.loadFileList()
    })
  }

  componentDidMount() {
    this.loadFileList()
  }

  handleChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      this.loadFileList()
    } else if (info.file.status === 'error') {
      if (info.file.error.status === 500) {
        message.error(`${info.file.name} already exists.`)
      } else {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }

  handleMenuClick = e => {
    console.log(e)
  }

  render() {
    const fileList = this.state.files.map(file => {
      return {
        key: file.id,
        name: file.name,
        size: fileSizeFormat(file.size),
        type: file.type,
        createdAt: file.createdAt,
        createdBy: file.createdBy.id,
      }
    })

    const props = {
      name: 'file',
      action: API_BASE_URL + '/files',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
      },
      showUploadList: false,
    }

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (fileName, record) => {
        return (
          <div>
            <Link onClick={() => this.handlePreview(record)}>{fileName}</Link>
          </div>
        )
      }
    }, {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    }, {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type='primary' icon='download' onClick={() => this.handleDownload(record.key, record.name)}>Download</Button>
          <Divider type='vertical' />
          <Button>Rename</Button>
          <Divider type='vertical' />
          <Button onClick={() => this.handleDelete(record.key)} type='danger'>Delete</Button>
        </span>
      )
    }]

    return (
      <Layout className='layout'>
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <Logo />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['0']} onClick={this.handleMenuClick}>
            <Menu.Item key="0">
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
        </Sider>
        <Layout>
          <MyHeader
            collapsed={this.state.collapsed}
            onToggle={this.toggle}
            onChange={this.handleChange}
            onLogout={this.props.onLogout}
            uploadProps={{ ...props }}
          />
          <Content style={{
            margin: '16px 10px', background: '#fff', minHeight: 900,
          }}
          >
            <Table columns={columns} dataSource={fileList} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Home)