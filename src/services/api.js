import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL_PREFIX+process.env.REACT_APP_API_URL+process.env.REACT_APP_API_SERVER_URL,
    timeout: 8000,
    timeoutErrorMessage: 'timeout'
})

export default api