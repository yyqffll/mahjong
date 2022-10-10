import axios, { AxiosRequestConfig } from 'axios'
export function request(config: AxiosRequestConfig<any>) {
  const instance = axios.create({
    method: 'POST'
  })
  instance.interceptors.response.use((res) => {
    const {
      data
    } = res
    if (data.success === false) {
      return Promise.reject(data)
    } else {
      return data
    }
  }, err => {
    return Promise.reject(err)
  })
  return instance(config)
}
