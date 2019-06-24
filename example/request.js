import axios from 'axios'
const request = axios.create({
  baseURL: 'https://www.easy-mock.com/mock/5d0df7f008bb853f252d5b0a'
})

request.interceptors.response.use(
  function ({ data }) {
    // 对响应数据做点什么
    return data
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 获取issue列表
export function getUsers (params) {
  return request({
    method: 'GET',
    url: '/users',
    params: params
  })
}
