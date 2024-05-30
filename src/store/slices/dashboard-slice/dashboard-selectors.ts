import { createDraftSafeSelector } from "@reduxjs/toolkit"
import { type RootState } from "../../store"

const dashboardSelector = (state: RootState) => state.dashboardReducer

export const getAssessmentsSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.assessments
  },
)

export const getLoadingSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.loading
  },
)