import { type AxiosResponse } from "axios"
import ErrorCode from "./error-codes"

const getResposneAccordingToStatus = (resposne:AxiosResponse<any,any>) =>{
  if(resposne.status === 200){
    return getSuccessResponse(resposne, ErrorCode[resposne.status].message)
  } else if(resposne.status === 401){
    return getFailureResponse(resposne,ErrorCode[resposne.status].message)
  }else{
    return getFailureResponse(resposne,"Message Not Register for the status code.")
  }
}

const getSuccessResponse = (responseData:AxiosResponse<any,any>, message:string) =>{
  responseData.data.result = 1
  responseData.data.message = message
  return responseData 
}
const getFailureResponse = (responseData:AxiosResponse<any,any>, message:string) =>{
  responseData.data.result = 0
  responseData.data.message = message
  return responseData 

}

export default getResposneAccordingToStatus
