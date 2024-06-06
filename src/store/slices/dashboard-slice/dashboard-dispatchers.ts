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
  } catch (e) {
    return { error: JSON.parse(JSON.stringify(e)) }
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
