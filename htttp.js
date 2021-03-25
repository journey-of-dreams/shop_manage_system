import axios from 'axios'
const http = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
})
// axios请求拦截
http.interceptors.request.use(config => {
    // 为请求头添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    console.log(config);
    return config
})
export default http