import { ACCESS_TOKEN } from '../constants'
import axios from '../axios-config'

export const login = loginRequest => axios.post('/auth/signin', loginRequest)

export const signUp = signUpRequest => axios.post('/auth/signup', signUpRequest)

export const checkUsernameAvailability = username => axios.get('/user/checkUsernameAvailability?username=' + username)

export const checkEmailAvailability = email => axios.get('/user/checkEmailAvailability?email=' + email)

export const getCurrentUser = () => localStorage.getItem(ACCESS_TOKEN) ? axios.get('/user/me') : Promise.reject("No access token set")

export const getUserProfile = username => axios.get('/users/' + username)
