import axios from 'axios'
import { ACCESS_TOKEN } from './constants';

const instance = axios.create({
  baseURL: 'http://localhost:9090/api',
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