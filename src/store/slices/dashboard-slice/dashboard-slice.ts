import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { setAssessmentDispatcher, setAssessmentModuleDispatcher, setAssessmentQuestionDispatcher, getLanguagesDispatcher, getModuleSubmissionDispatcher } from "./dashboard-dispatchers";

const initialState: DashboardDataType = {
  assessments: [],
  assessmentModuleData: {},
  assessmentQuestion: {},
  programmingLang: [],
  loading: false,
};

export const dashboardSlice = createSlice({
  name: "dashboardReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAssessmentDispatcher.pending, (state: any) => {
        state.loading = true;
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
        state.loading = true;
      })
      .addCase(setAssessmentModuleDispatcher.fulfilled, (state: any, action: any) => {
        if (action.payload?.data?.status) {
          state.assessmentModuleData = action?.payload?.data
          localStorage.setItem("talaura-test-crs", action?.payload?.data?.userToken)
        }
        state.loading = false;
      })
      .addCase(setAssessmentModuleDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
    builder
      .addCase(setAssessmentQuestionDispatcher.pending, (state: any) => {
        state.loading = true;
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
        state.loading = true;
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
  },
});
export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
