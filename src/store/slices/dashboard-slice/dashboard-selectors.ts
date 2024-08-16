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

export const getQuizLoadingSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.quizLoading
  },
)

export const getAssessmentModuleSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.assessmentModuleData
  },
)
export const getAssessmentQuestionSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.assessmentQuestion
  },
)

export const getLanguageSelector = createDraftSafeSelector(
  [dashboardSelector],
  items => {
    return items.programmingLang
  },
)