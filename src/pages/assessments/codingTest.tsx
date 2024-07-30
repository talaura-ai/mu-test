import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Workspace from "../../components/Workspace/Workspace";
import { problems } from "../../utils/problems";
import TimeLeftIcon from "../../assets/svg/timeLeftIcon.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { getModuleSubmissionDispatcher, setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";

const CodingTest: React.FC<any> = (props) => {
  const problem = problems["two-sum"];
  problem.handlerFunction = problem.handlerFunction?.toString();
  const dispatcher = useAppDispatch()
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector)
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([])

  useUserActivityDetection()

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      setModuleQuestions(assessmentModule?.module?.question?.[0])
    }
  }, [assessmentModule])

  React.useEffect(() => {
    dispatcher(setAssessmentModuleDispatcher(
      {
        "moduleId": testId,
        "candidateId": userId,
        "assessmentId": assessmentId
      }
    ))
  }, [dispatcher, assessmentId, testId, userId])

  const onTimeout = () => {
    if (Number(assessmentModule.module?.time) > 0) {
      navigate(-1)
    }
  }

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <TimerCounterWithProgress timestamp={ assessmentModule.module?.time || 0 } title={ assessmentModule.module?.name } onTimeout={ onTimeout } />
      <Workspace problem={ moduleQuestions } moduleData={ { ...assessmentModule, ...moduleQuestions, } } />
    </div>
  );
};
export default CodingTest;
