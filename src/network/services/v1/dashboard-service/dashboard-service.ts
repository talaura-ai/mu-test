import { Endpoints } from "../../../enpoints/v1"
import AxiosService from "../../../client-interceptor"

// const Subscribers = async (query: string) => {
//   return await AxiosService.get(Endpoints.Subscribers + query)
// }

const getAssessments = async (body: any) => {
  return await AxiosService.post(Endpoints.assessmentList, body)
}

const getAssessmentModules = async (body: any) => {
  return await AxiosService.post(Endpoints.assessmentModule, body)
}

const getAssessmentQuestionModules = async (body: any) => {
  return await AxiosService.post(Endpoints.assessmentQuestion, body)
}
export default { getAssessments, getAssessmentModules, getAssessmentQuestionModules }
