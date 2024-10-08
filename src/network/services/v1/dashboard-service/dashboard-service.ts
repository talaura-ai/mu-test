import { Endpoints } from "../../../enpoints/v1"
import AxiosService from "../../../client-interceptor"
import Judge0AxiosService from '../../../client-interceptor/judge0';

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

const getProgrammingLanguage = async () => {
  return await Judge0AxiosService.get(Endpoints.programming)
}

const getSubmission = async (body: any) => {
  return await AxiosService.post(Endpoints.submitTest, body)
}
const codeSubmission = async (body: any) => {
  return await Judge0AxiosService.post(Endpoints.codeSubmission, body)
}
const submissionStatus = async (query: any) => {
  return await Judge0AxiosService.get(Endpoints.submissionStatus + query)
}
const updateActivity = async (body: any) => {
  return await AxiosService.post(Endpoints.userActivity, body)
}
export default { getAssessments, getAssessmentModules, getAssessmentQuestionModules, getProgrammingLanguage, getSubmission, codeSubmission, submissionStatus, updateActivity }
