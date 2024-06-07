import axios from "axios"
import { getAxiosResposeInterceptors } from '../interceptors'
import { Endpoints } from "../enpoints/v1";

const AxiosService = axios.create({
  baseURL: 'https://fantasytradingleague.com/api/talaura',
});

AxiosService.interceptors.request.use(
  async function (request) {
    if (request?.url === Endpoints.submitTest) {
      const token = localStorage.getItem("talaura-test-crs");
      if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return request
  },
  async function (error) { return await Promise.reject(error) }
)

AxiosService.interceptors.response.use(response => {
  return getAxiosResposeInterceptors(response)
})

export default AxiosService
