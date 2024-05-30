import axios from "axios"
import { getAxiosResposeInterceptors } from '../interceptors'

const AxiosService = axios.create({
  baseURL: 'https://fantasytradingleague.com/api/talaura',
});

AxiosService.interceptors.request.use(
  async function (request) {
    const isLoggedIn = localStorage.getItem("talaura-crs-token");
    if (isLoggedIn) {
      request.headers['Authorization'] = `Bearer ${isLoggedIn}`
    }
    return request
  },
  async function (error) { return await Promise.reject(error) }
)

AxiosService.interceptors.response.use(response => {
  return getAxiosResposeInterceptors(response)
})

export default AxiosService
