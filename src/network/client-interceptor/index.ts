import axios from "axios"
import { getAxiosResposeInterceptors } from '../interceptors'
import { Endpoints } from "../enpoints/v1";

const AxiosService = axios.create({
  baseURL: 'https://dwtc.apiserver.talaura.ai',
});

AxiosService.interceptors.request.use(
  async function (request) {
    if (request?.url === Endpoints.submitTest) {
      const token = sessionStorage.getItem("talaura-test-crs");
      if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return request
  },
  async function (error) {
    return await Promise.reject(error)
  }
)

AxiosService.interceptors.response.use(response => {
  return getAxiosResposeInterceptors(response)
}, async function (error) {
  if (error?.response?.status === 403) {
    window.location.href = "/"
  }
  return await Promise.reject(error)
})

export default AxiosService
