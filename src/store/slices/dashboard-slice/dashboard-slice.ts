import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { setAssessmentDispatcher, setAssessmentModuleDispatcher, setAssessmentQuestionDispatcher, getLanguagesDispatcher, getModuleSubmissionDispatcher, getSendSubmissionDispatcher, getSubmissionStatusDispatcher, getUserActivityDispatcher } from "./dashboard-dispatchers";

const initialState: DashboardDataType = {
  assessments: [],
  assessmentModuleData: {},
  assessmentQuestion: {},
  programmingLang: [],
  loading: false,
  quizLoading: false
};

export const dashboardSlice = createSlice({
  name: "dashboardReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
    setQuizLoading: (state, action: PayloadAction<any>) => {
      state.quizLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAssessmentDispatcher.pending, (state: any) => {
        // state.loading = true;
      })
      .addCase(setAssessmentDispatcher.fulfilled, (state: any, action: any) => {
        if (action.payload?.data?.status) {
          state.assessments = action?.payload?.data?.getUser
        }
        state.loading = false;
      })
      .addCase(setAssessmentDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(setAssessmentModuleDispatcher.pending, (state: any) => {
        // state.loading = true;
      })
      .addCase(setAssessmentModuleDispatcher.fulfilled, (state: any, action: any) => {
        if (action.payload?.data?.status) {
          const { moduleId, candidateId } = action?.meta?.arg
          state.assessmentModuleData = action?.payload?.data
          sessionStorage.setItem("talaura-test-crs", action?.payload?.data?.userToken)
          sessionStorage.setItem(`${moduleId}-${candidateId}`, btoa(unescape(encodeURIComponent(JSON.stringify(action?.payload?.data)))))
          sessionStorage.setItem(`txp-${moduleId}-${candidateId}`, String(action?.payload?.data?.module?.time || 0))
        }
        state.loading = false;
        state.quizLoading = false;
      })
      .addCase(setAssessmentModuleDispatcher.rejected, (state: any) => {
        state.loading = false;
        state.quizLoading = false;
      })
    builder
      .addCase(setAssessmentQuestionDispatcher.pending, (state: any) => {
        // state.loading = true;
      })
      .addCase(setAssessmentQuestionDispatcher.fulfilled, (state: any, action: any) => {
        if (action.payload?.data?.status) {
          state.assessmentQuestion = action?.payload?.data
        }
        state.loading = false;
      })
      .addCase(setAssessmentQuestionDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(getLanguagesDispatcher.pending, (state: any) => {
        // state.loading = true;
      })
      .addCase(getLanguagesDispatcher.fulfilled, (state: any, action: any) => {
        if (action.payload?.data) {
          state.programmingLang = action?.payload?.data
        }
        state.loading = false;
      })
      .addCase(getLanguagesDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(getModuleSubmissionDispatcher.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(getModuleSubmissionDispatcher.fulfilled, (state: any, action: any) => {
        state.loading = false;
      })
      .addCase(getModuleSubmissionDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(getSendSubmissionDispatcher.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(getSendSubmissionDispatcher.fulfilled, (state: any, action: any) => {
        state.loading = false;
      })
      .addCase(getSendSubmissionDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(getSubmissionStatusDispatcher.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(getSubmissionStatusDispatcher.fulfilled, (state: any, action: any) => {
        state.loading = false;
      })
      .addCase(getSubmissionStatusDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(getUserActivityDispatcher.pending, (state: any) => {
        state.loading = false;
      })
      .addCase(getUserActivityDispatcher.fulfilled, (state: any, action: any) => {
        state.loading = false;
      })
      .addCase(getUserActivityDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
  },
});
export const { setLoading, setQuizLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
