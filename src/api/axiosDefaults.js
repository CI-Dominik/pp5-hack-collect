import axios from 'axios'

axios.defaults.baseURL = 'https://pp5-hack-collect-drf-f277d220324f.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();