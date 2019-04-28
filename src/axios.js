import axios from 'axios'
import { ACCESS_TOKEN, API_BASE_URL } from './constants';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(config => {
  if (localStorage.getItem(ACCESS_TOKEN)) {
    config.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
  }
  return config
}, err => Promise.reject(err))

export default instance