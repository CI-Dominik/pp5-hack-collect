import axios from 'axios'

// Axios settings

axios.defaults.baseURL = 'https://pp5-hack-collect-drf-f277d220324f.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

// Create Axios instances

export const axiosReq = axios.create();
export const axiosRes = axios.create();