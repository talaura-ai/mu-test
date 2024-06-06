import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { setAssessmentDispatcher, setAssessmentModuleDispatcher, setAssessmentQuestionDispatcher } from "./dashboard-dispatchers";

const initialState: DashboardDataType = {
  assessments: [],
  assessmentModuleData: {},
  assessmentQuestion: {},
  loading: false
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
  },
});
export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
