import React, { Component } from 'react'
import { FILE_LIST_SIZE } from './constants';
import { getUserFiles, downloadFile } from './util/ApiUtils';
import {
  Upload, Button, Icon, message,
} from 'antd';
import { uploadFile } from './util/ApiUtils'

class Home extends Component {
  state = {
    files: [],
    loading: false,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    uploading: false,
    uploadFile: null,
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

  handleUpload = () => {
    const formData = new FormData()
    formData.append('file', this.state.uploadFile)

    this.setState({ uploading: true })

    uploadFile(formData).then(res => {
      console.log(res.data)
      this.loadFileList()
      this.setState({
        uploadFile: null,
        uploading: false,
      })
    }).catch(err => {
      this.setState({ uploading: false })
    })
  }

  handleDownload = id => {
    downloadFile(id).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  componentDidMount() {
    this.loadFileList()
  }

  render() {
    const fileList = this.state.files.map(file => (
      <File key={file.id} fileInfo={file} onDownload={this.handleDownload} />
    ))

    const { uploadFile } = this.state
    const props = {
      onRemove: file => {
        this.setState(prevState => prevState.uploadFile ? { uploadFile: null } : null)
      },
      beforeUpload: file => {
        this.setState(prevState => prevState.uploadFile ? null : { uploadFile: file })
        return false
      },
      uploadFile
    }


    return (
      <div>
        <div>
          <Upload {...props}>
            <Button>
              <Icon type='upload' />Select File
            </Button>
          </Upload>
          <Button
            type='primary'
            onClick={this.handleUpload}
            loading={this.state.uploading}
            style={{ marginTop: 16 }}
          >
            {this.state.uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
        {fileList}
        <button onClick={this.props.onLogout}>Logout</button>
      </div>
    )
  }
}

const File = (props) => (
  <div>
    {props.fileInfo.id} {props.fileInfo.name} {props.fileInfo.size} {props.fileInfo.createdAt} <button onClick={() => props.onDownload(props.fileInfo.id)}>download</button>
  </div>
)

export default Home