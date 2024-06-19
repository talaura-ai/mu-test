import { useNavigate, useParams } from "react-router-dom";
import UserIcon from "../../assets/svg/userIcon.svg";
import QuestionNumberBox from "../../components/questionNumberBox";
import QuestionOptionBox from "../../components/displayQuestionOptions";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { getModuleSubmissionDispatcher, setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import TimerCounter from "../../components/timerCounter";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";

function StartMCQTest () {
  const dispatcher = useAppDispatch()
  const navigate = useNavigate();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector)
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([])
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const [selectedQuestion, setSelectedQuestion] = React.useState("")
  const [disableNextBtn, setDisableNextBtn] = React.useState(false)
  const [submitTest, setSubmitTest] = React.useState(false)
  const [disablePrevBtn, setDisablePrevBtn] = React.useState(true)
  const { assessmentId, testId } = useParams();

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      setModuleQuestions(assessmentModule?.module?.question)
      setQuestionIndex(0)
    }
  }, [assessmentModule])

  React.useEffect(() => {
    dispatcher(setAssessmentModuleDispatcher(
      {
        "moduleId": testId,
        "candidateId": "6672c49c3301a6048a286467",
        "assessmentId": assessmentId
      }
    ))
  }, [dispatcher, assessmentId, testId])

  const onQuestionSelection = (option: any) => {
    let optionValue = ""
    if (option !== selectedQuestion) {
      optionValue = option
    }
    let updateQuestion = [...moduleQuestions]
    updateQuestion[questionIndex] = { ...updateQuestion[questionIndex], answer: optionValue }
    setModuleQuestions(updateQuestion)
    setSelectedQuestion(optionValue)
  }

  const onPrevClicked = () => {
    if (questionIndex - 1 === 0) {
      setDisablePrevBtn(true)
    } else {
      setDisablePrevBtn(false)
    }
    if (questionIndex) {
      setSelectedQuestion(moduleQuestions?.[questionIndex - 1 === 0 ? 0 : questionIndex - 1]?.answer || "")
      setQuestionIndex((prev) => {
        return prev - 1
      })
    }
    setDisableNextBtn(false)
  }

  const onNextClicked = () => {
    if (moduleQuestions?.length - 2 === questionIndex) {
      setDisableNextBtn(true)
    } else {
      setDisableNextBtn(false)
    }
    if (moduleQuestions?.length - 1 > questionIndex) {
      setSelectedQuestion(moduleQuestions?.[moduleQuestions?.length - 1 === questionIndex ? 0 : questionIndex + 1]?.answer || "")
      setQuestionIndex((prev) => {
        return prev + 1
      })
    }
    setDisablePrevBtn(false)
  }

  const directQuestionClicked = (index: number) => {
    setSelectedQuestion(moduleQuestions?.[index - 1]?.answer || "")
    setQuestionIndex(index - 1)
    if (index === moduleQuestions?.length) {
      setDisableNextBtn(true)
    } else {
      setDisableNextBtn(false)
    }
    if (index === 1) {
      setDisablePrevBtn(true)
    } else {
      setDisablePrevBtn(false)
    }
  }

  const getProgress = () => {
    let answered = 0
    moduleQuestions?.map((v: any) => {
      if (v?.answer) {
        answered++
      }
    })
    return (answered * 100) / moduleQuestions?.length
  }

  const onSubmission = (type: string) => {
    if (type === "submit") {
      console.log('DATA=>', moduleQuestions)
      submitTestClicked()
    }
    setSubmitTest(false)
  }

  const submitTestClicked = async () => {
    try {
      const res = await dispatcher(getModuleSubmissionDispatcher({
        moduleId: testId,
        question: moduleQuestions
      }))
      if (res?.payload.data?.status) {
        navigate(-1)
      }
    } catch (error) {
      console.log('error=>', error)
    }
  }

  const onTimeout = () => {
    submitTestClicked()
  }

  return (
    <>
      <div className="sm:p-6 md:px-20 md:py-12 p-4">
        <TimerCounter timestamp={ assessmentModule.module?.time || 0 } title={ assessmentModule.module?.name } onTimeout={ onTimeout } />
        <div className="flex items-center mb-10 px-4 font-sansation">
          <div className="w-full bg-[#C7C6C0] rounded-full h-2.5 mb-4 dark:bg-gray-700 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
            <div
              className="bg-gradient-to-r from-[#E5A971] to-[#F3BC84] h-2.5 rounded-full"
              style={ { width: `${getProgress()}%` } }
            ></div>
          </div>
        </div>
        <div className="mb-6 flex md:flex-row flex-col font-sansation">
          <div className="basis-[30%] w-full">
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <div className="flex flex-row items-center mx-6 py-5 border-solid border-b-[3px] border-[#E6E6E6]">
                <img
                  className="w-16 h-16 rounded-full shadow-lg"
                  src={ UserIcon }
                  alt="user"
                />
                <h5 className="text-[24px] font-medium text-black ml-5">
                  John Smith
                </h5>
              </div>
              <div className="flex flex-col mx-8 py-4">
                <h5 className="text-[18px] font-normal text-black">
                  Question analysis
                </h5>
                <div className=" flex w-full items-center space-x-2 mt-2">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#F3BC84]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Question analysis
                  </h5>
                  <div className="w-[2px] min-h-[14px] bg-[#B1B1B1]"></div>
                  <div className="w-[12px] h-[12px] rounded-full border-[#B1B1B1] border-solid border-[2px]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Question analysis
                  </h5>
                </div>
                <div className=" flex flex-wrap w-full gap-5 my-5">
                  { moduleQuestions?.map((question: any, index: number) => (
                    <QuestionNumberBox
                      questionNo={ index + 1 }
                      checked={ question?.answer }
                      key={ question?._id }
                      directQuestionClicked={ directQuestionClicked }
                    />
                  )) }
                </div>
              </div>
              <button
                type="button"
                onClick={ () => { setSubmitTest(true) } }
                className={ `flex w-full text-white bg-[#CC8448] tracking-wide font-medium text-md px-12 py-2.5 text-center justify-center items-center font-sansation cursor-pointer` }
              >
                Submit Test
              </button>
            </div>
          </div>
          <div className="basis-[70%]">
            <div className="md:px-20 px-6 md:pt-0 pt-6">
              <div className="flex">
                <div>
                  <h5 className="text-[22px] font-normal text-black select-none">
                    Q{ questionIndex + 1 }.
                  </h5>
                </div>
                <div>
                  <h5 className="text-[22px] font-normal text-black pl-[10px] select-none">
                    { moduleQuestions?.[questionIndex]?.title || "" }
                  </h5>
                </div>
              </div>
              <div className="space-y-5 mt-6 ml-10">
                { moduleQuestions?.[questionIndex]?.options?.map((option: any, index: number) => (
                  <QuestionOptionBox key={ option } onSelection={ (v: any) => { onQuestionSelection(v) } } option={ option } index={ index } checked={ selectedQuestion } />
                )) }
              </div>
            </div>
            <div className="flex w-full justify-between mt-20">
              <button
                type="button"
                disabled={ disablePrevBtn }
                onClick={ onPrevClicked }
                className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
              >
                <FaArrowLeft className="mr-2" />
                PREVIOUS
              </button>
              <button
                type="button"
                disabled={ disableNextBtn }
                onClick={ onNextClicked }
                className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
              >
                NEXT <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      { submitTest ? <ModuleConfirmationModal onPress={ (v) => { onSubmission(v) } } /> : null }
    </>
  );
}

export default StartMCQTest;
