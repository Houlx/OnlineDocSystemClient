import React, { Component } from 'react'
import { FILE_LIST_SIZE, PREVIEW_SERVICE_URL, FILE_RESOURCE_URL } from '../../constants';
import { getUserFiles, downloadFile, deleteFile, rename, } from '../../util/ApiUtils';
import {
  Button, message, Layout, Table, Divider, Input, Form, Popconfirm, Pagination, Icon,
} from 'antd';
import './Home.css'
import { fileSizeFormat } from '../../util/FileUtil';
import Logo from './components/Logo'
import MyHeader from './components/myheader/MyHeader'
import { FileType } from "../../constants";
import { withRouter } from "react-router-dom";
import SiderMenu from './components/SiderMenu';
import Highlighter from 'react-highlight-words'
import pinyin from 'pinyin';

const { Sider, Content } = Layout
const FormItem = Form.Item

const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

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
    menuIndex: 0,
    searchText: '',
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }


  handlePreview = item => {
    if (item.type === FileType.PDF) {
      // window.open(FILE_RESOURCE_URL + this.props.currentUser.id + '/' + fileName, '_blank').focus()
      window.open(FILE_RESOURCE_URL + item.groupName + '/' + item.remoteFileName, '_blank').focus()
    } else {
      window.open(PREVIEW_SERVICE_URL + FILE_RESOURCE_URL + item.groupName + '/' + item.remoteFileName, '_blank').focus()
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    editable: true,
    width: 420,
    ...this.getColumnSearchProps('name'),
    render: (text, record) => (
      <span>
        <Icon type='edit' />
        {text}
      </span>
    ),
    defaultSortOrder: 'ascend',
    sorter: (a, b) => pinyin.compare(a.name, b.name),
    sortDirections: ['descend', 'ascend'],
  }, {
    title: 'Ext',
    dataIndex: 'ext',
    key: 'ext',
    width: 160,
  }, {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    width: 160,
  }, {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 240,
  }, {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 240,
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Button type="primary" shape="circle" icon="download" size={"default"} onClick={() => this.handleDownload(record.key, record.name + '.' + record.ext.toLowerCase())} />
        <Divider type='vertical' />
        <Button shape="circle" icon="eye" size={"default"} onClick={() => this.handlePreview(record)} />
        <Divider type='vertical' />
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
          <Button type="danger" shape="circle" icon="delete" size={"default"} />
        </Popconfirm>
      </span>
    )
  }]

  loadFileList = (page = 0, size = FILE_LIST_SIZE, typeId) => {
    let promise = getUserFiles(page, size, typeId)
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
      this.loadFileList(0, FILE_LIST_SIZE, this.state.menuIndex)
    }).then(_ => { this.props.onLoadUser() })
  }

  componentDidMount() {
    this.loadFileList(0, FILE_LIST_SIZE, this.state.menuIndex)
  }

  handleUploadChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      this.loadFileList(0, FILE_LIST_SIZE, this.state.menuIndex)
      this.props.onLoadUser()
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
    this.loadFileList(0, FILE_LIST_SIZE, e.key)
    this.setState({ menuIndex: e.key })
  }

  handleSave = (row) => {
    console.log(row)
    const file = this.state.files.find(file => row.key === file.id)
    if (file.name.substring(0, file.name.lastIndexOf('.')) !== row.name) {
      rename(row.key, row.name).then(res => {
        this.loadFileList(0, FILE_LIST_SIZE, this.state.menuIndex)
      })
    }
  }

  handlePageChange = (page) => {
    console.log(page)
    // this.setState({ page: page })
    this.loadFileList(page - 1, FILE_LIST_SIZE, this.state.menuIndex)
    this.setState({ page: page - 1 })
  }

  render() {
    const fileList = this.state.files.map(file => {
      return {
        key: file.id,
        name: file.name.substring(0, file.name.lastIndexOf('.')),
        size: fileSizeFormat(file.size),
        type: file.type,
        ext: file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase(),
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        groupName: file.groupName,
        remoteFileName: file.remoteFileName,
        pinyin: pinyin(this.name),
      }
    })

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      }
    })

    console.log(this.state.totalPages)

    return (
      <Layout className='layout'>
        <Sider
          className='app-sider'
          theme="light"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <Logo display={this.state.collapsed} />
          <SiderMenu onClick={this.handleMenuClick} />
        </Sider>
        <Layout className='app-container'>
          <MyHeader
            collapsed={this.state.collapsed}
            onToggle={this.toggle}
            onChange={this.handleUploadChange}
            onLogout={this.props.onLogout}
            currentUser={this.props.currentUser}
            onLoadUser={this.props.onLoadUser}
          />
          <Content style={{
            margin: '16px 10px', background: '#fff', minHeight: 900
          }}
          >
            <Pagination style={{ padding: 10, }} current={this.state.page + 1} onChange={this.handlePageChange} total={this.state.totalPages * 10} />
            <Table components={components} columns={columns} dataSource={fileList} rowClassName={() => 'editable-row'} pagination={false} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Home)