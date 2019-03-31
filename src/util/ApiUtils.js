import { ACCESS_TOKEN } from '../constants'
import axios from '../axios-config'

export const login = loginRequest => axios.post('/auth/signin', loginRequest)

export const signUp = signUpRequest => axios.post('/auth/signup', signUpRequest)

export const checkUsernameAvailability = username => axios.get('/user/checkUsernameAvailability?username=' + username)

export const checkEmailAvailability = email => axios.get('/user/checkEmailAvailability?email=' + email)

export const getCurrentUser = () => {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set")
  } else {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
  }

  console.log(axios.defaults.headers)
  return axios.get('/user/me')
}

export const getUserProfile = username => axios.get('/users/' + username)
