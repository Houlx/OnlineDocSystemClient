import { ACCESS_TOKEN, FILE_LIST_SIZE } from '../constants'
import axios from '../axios'

export const login = loginRequest => axios.post('/auth/signin', loginRequest)

export const signUp = signUpRequest => axios.post('/auth/signup', signUpRequest)

export const checkUsernameAvailability = username => axios.get('/user/checkUsernameAvailability?username=' + username)

export const checkEmailAvailability = email => axios.get('/user/checkEmailAvailability?email=' + email)

export const getCurrentUser = () => localStorage.getItem(ACCESS_TOKEN) ? axios.get('/user/me') : Promise.reject("No access token set")

export const getUserProfile = username => axios.get('/admin/users/' + username)

export const uploadFile = formData => axios.post('/files', formData, {
  headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8', }
})

export const getUserFiles = (page, size, typeId) => {
  page = page || 0
  size = size || FILE_LIST_SIZE

  return localStorage.getItem(ACCESS_TOKEN) ? axios.get('/files/' + typeId + '?page=' + page + '&size=' + size) : Promise.reject('No access token set')
}

export const apiDownloadFile = (id) => axios({
  url: '/files/download/' + id,
  method: 'GET',
  responseType: 'blob',
})

export const downloadFile = (id, name) => {
  apiDownloadFile(id).then(res => {
    if (res.headers['content-type'] !== 'application/json') {
      console.log(res)
      let blob = new Blob([res.data])
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, name);
      } else {
        let link = document.createElement("a");
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    }
  })
}

export const deleteFile = id => axios.delete('/files/' + id)

export const rename = (id, newName) => axios.post('/files/' + id + '?newName=' + newName)