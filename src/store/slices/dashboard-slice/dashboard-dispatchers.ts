import { createAsyncThunk } from "@reduxjs/toolkit"
import Services from "../../../network/services/v1"
import { AppDispatch } from "../../store"
import { setLoading } from "./dashboard-slice"

export const setLoadingDispatcher =
  (value: boolean) => (dispatch: AppDispatch) => {
    return dispatch({ type: setLoading.type, payload: value })
  }

export const setAssessmentDispatcher: any = createAsyncThunk("assessment", async (request: string) => {
  try {
    return await Services.DashboardService.getAssessments(request)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})

export const setAssessmentModuleDispatcher: any = createAsyncThunk("module", async (request: string) => {
  try {
    return await Services.DashboardService.getAssessmentModules(request)
  } catch (e: any) {
    return { error: JSON.parse(JSON.stringify(e?.response?.data)) }
  }
})


export const setAssessmentQuestionDispatcher: any = createAsyncThunk("assessmentQuestion", async (request: string) => {
  try {
    return await Services.DashboardService.getAssessmentQuestionModules(request)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})


export const getLanguagesDispatcher: any = createAsyncThunk("programminglanguage", async () => {
  try {
    return await Services.DashboardService.getProgrammingLanguage()
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})

export const getModuleSubmissionDispatcher: any = createAsyncThunk("submit-test", async (bode: any) => {
  try {
    return await Services.DashboardService.getSubmission(bode)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})

export const getSendSubmissionDispatcher: any = createAsyncThunk("code-submission", async (bode: any) => {
  try {
    return await Services.DashboardService.codeSubmission(bode)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})

export const getSubmissionStatusDispatcher: any = createAsyncThunk("submission-status", async (query: any) => {
  try {
    return await Services.DashboardService.submissionStatus(query)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})

export const getUserActivityDispatcher: any = createAsyncThunk("user-activity", async (body: any) => {
  try {
    return await Services.DashboardService.updateActivity(body)
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
  }
})
