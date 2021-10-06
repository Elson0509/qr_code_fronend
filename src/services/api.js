import axios from 'axios'
import * as Constants from './constants'

const api = axios.create({
    baseURL: Constants.API_URL_PREFIX+Constants.API_URL+':'+Constants.API_PORT+Constants.API_SERVER_URL
})

export default api