import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { setAssessmentDispatcher } from "./dashboard-dispatchers";

const initialState: DashboardDataType = {
  assessments: [],
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
        console.log('action.payload=>', action.payload)
        if (action.payload?.data?.status) {
          state.assessments = action?.payload?.data?.getUser          
        }
        state.loading = false;
      })
      .addCase(setAssessmentDispatcher.rejected, (state: any) => {
        state.loading = false;
      })
  },
});
export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
