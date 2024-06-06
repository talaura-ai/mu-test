import axios from "axios"
import { getAxiosResposeInterceptors } from '../interceptors'

const Judge0AxiosService = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com",
});

Judge0AxiosService.interceptors.request.use(
  async function (request) {
    const isLoggedIn = localStorage.getItem("talaura-crs-token");
    if (isLoggedIn) {
      request.headers['Authorization'] = `Bearer ${isLoggedIn}`

    }
    request.headers['X-RapidAPI-Key'] = "bea28457e2msh0b94f8a6f3e5af3p145d10jsnf5a33f1053ef"
    request.headers['X-RapidAPI-Host'] = "judge0-ce.p.rapidapi.com"

    return request
  },
  async function (error) { return await Promise.reject(error) }
)

Judge0AxiosService.interceptors.response.use(response => {
  return getAxiosResposeInterceptors(response)
})

export default Judge0AxiosService


