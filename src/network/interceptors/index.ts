import { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import getResposneAccordingToStatus from "../response-handlers"

export const getAxiosRequestInterceptors = (config: InternalAxiosRequestConfig<any>) => {
  console.log('config', config)
  return config
}

export const getAxiosResposeInterceptors = (resposne: AxiosResponse<any, any>) => {
  /**
   * We can attach logger here and we can modulate response  as well here 
   * example in case
   */
  return getResposneAccordingToStatus(resposne)
}
