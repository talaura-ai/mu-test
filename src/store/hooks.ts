import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "./store"
import { type ThunkAction, type Action } from "@reduxjs/toolkit"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
