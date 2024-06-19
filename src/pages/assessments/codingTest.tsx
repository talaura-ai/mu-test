import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Workspace from "../../components/Workspace/Workspace";
import { problems } from "../../utils/problems";
import TimeLeftIcon from "../../assets/svg/timeLeftIcon.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { getModuleSubmissionDispatcher, setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";

const CodingTest: React.FC<any> = (props) => {
  const problem = problems["two-sum"];
  problem.handlerFunction = problem.handlerFunction?.toString();
  const dispatcher = useAppDispatch()
  const navigate = useNavigate();
  const { assessmentId, testId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector)
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([])

  console.log('assessmentModule---', assessmentModule)

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      setModuleQuestions(assessmentModule?.module?.question?.[0])
    }
  }, [assessmentModule])

  React.useEffect(() => {
    dispatcher(setAssessmentModuleDispatcher(
      {
        "moduleId": testId,
        "candidateId": "6671852aabe0110fa47d7903",
        "assessmentId": assessmentId
      }
    ))
  }, [dispatcher, assessmentId, testId])

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-6 font-sansation">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            Module 2: Coding
          </span>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="w-full flex">
            <p className="text-[18px] text-[#FB2121] font-semibold">
              Time left
            </p>
            <img src={ TimeLeftIcon } className="px-2" alt="left icon" />
            <p className="text-[18px] text-[#FB2121] font-semibold">
              20:39 min
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center mb-6 px-4 font-sansation">
        <div className="w-full bg-[#C7C6C0] rounded-full h-2.5 mb-4 dark:bg-gray-700 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <div
            className="bg-gradient-to-r from-[#E5A971] to-[#F3BC84] h-2.5 rounded-full"
            style={ { width: `${50}%` } }
          ></div>
        </div>
      </div>
      <Workspace problem={ moduleQuestions } />
    </div>
  );
};
export default CodingTest;
