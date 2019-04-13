import { ACCESS_TOKEN, FILE_LIST_SIZE } from '../constants'
import axios from '../axios'

export const login = loginRequest => axios.post('/auth/signin', loginRequest)

export const signUp = signUpRequest => axios.post('/auth/signup', signUpRequest)

export const checkUsernameAvailability = username => axios.get('/user/checkUsernameAvailability?username=' + username)

export const checkEmailAvailability = email => axios.get('/user/checkEmailAvailability?email=' + email)

export const getCurrentUser = () => localStorage.getItem(ACCESS_TOKEN) ? axios.get('/user/me') : Promise.reject("No access token set")

export const getUserProfile = username => axios.get('/users/' + username)

export const uploadFile = formData => axios.post('/files', formData, {
  headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8', }
})

export const getUserFiles = (page, size) => {
  page = page || 0
  size = size || FILE_LIST_SIZE

  return localStorage.getItem(ACCESS_TOKEN) ? axios.get('/files?page=' + page + '&size=' + size) : Promise.reject('No access token set')
}

export const downloadFile = id => axios.get('/files/download/' + id) //FIXME 