import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./slices/dashboard-slice/dashboard-slice";

const RootReducer = combineReducers({
  dashboardReducer: dashboardSlice
});
export const store = configureStore({
  reducer: RootReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export type AppDispatch = typeof store.dispatch;
