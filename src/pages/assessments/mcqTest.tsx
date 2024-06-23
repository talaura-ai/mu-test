import { useNavigate, useParams } from "react-router-dom";
import UserIcon from "../../assets/svg/userIcon.svg";
import QuestionNumberBox from "../../components/questionNumberBox";
import QuestionOptionBox from "../../components/displayQuestionOptions";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { getModuleSubmissionDispatcher, setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";

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
  const { assessmentId, testId, userId } = useParams();

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
        "candidateId": userId,
        "assessmentId": assessmentId
      }
    ))
  }, [dispatcher, assessmentId, testId, userId])

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

  const onSubmission = (type: string) => {
    if (type === "submit") {
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
        toast.success(`${assessmentModule.module?.name} completed successfully!`, {});
        navigate(-1)
      } else {
        toast.error("Oops! Failed", {});
      }
    } catch (error) {
      console.log('error=>', error)
      toast.error("Oops! Internal server error", {});
    }
  }

  const onTimeout = () => {
    if (Number(assessmentModule.module?.time) > 0) {
      submitTestClicked()
    }
  }

  const onReview = () => {
    let updateQuestion = [...moduleQuestions]
    updateQuestion[questionIndex] = { ...updateQuestion[questionIndex], review: !updateQuestion[questionIndex]?.review }
    setModuleQuestions(updateQuestion)
  }

  return (
    <>
      <div className="md:px-20 md:pt-12 px-4">
        <TimerCounterWithProgress timestamp={ assessmentModule.module?.time || 0 } title={ assessmentModule.module?.name } onTimeout={ onTimeout } />
        <div className="flex md:flex-row flex-col font-sansation mt-10">
          <div className="basis-[30%] w-full md:mr-12">
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
                    Answered
                  </h5>
                  <div className="w-[2px] min-h-[14px] bg-[#B1B1B1]"></div>
                  <div className="w-[12px] h-[12px] rounded-full border-[#B1B1B1] border-solid border-[2px]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Not Answered
                  </h5>
                  <div className="w-[2px] min-h-[14px] bg-[#B1B1B1]"></div>
                  <div className="w-[12px] h-[12px] rounded-full border-[#F15C2E] bg-[#F15C2E] border-solid border-[2px]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Review
                  </h5>
                </div>
                <div className=" flex flex-wrap w-full gap-5 my-5">
                  { moduleQuestions?.map((question: any, index: number) => (
                    <QuestionNumberBox
                      questionNo={ index + 1 }
                      checked={ question?.answer }
                      key={ question?._id }
                      review={ question?.review }
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
          <div className="basis-[70%] relative md:border-l-[2px] md:border-[#DCDCD9]">
            <div className="mcq-q pb-44">
              <div className="md:px-12 px-6 md:pt-0 pt-6">
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
            </div>
            <div className="w-full absolute bottom-0 left-0 right-0 bg-[#F9F7F0] pb-6 pt-6">
              <div className="flex w-full md:justify-end justify-center mb-3">
                <button
                  type="button"
                  onClick={ onReview }
                  className="md:mx-20 mx-6 flex text-white bg-[#F15C2E] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
                >
                  Review
                </button>
              </div>
              <div className="flex w-full md:justify-between md:flex-row flex-col justify-center items-center md:gap-0 gap-4">
                <button
                  type="button"
                  disabled={ disablePrevBtn }
                  onClick={ onPrevClicked }
                  className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
                >
                  <FaArrowLeft className="mr-2" />
                  PREVIOUS
                </button>
                { moduleQuestions?.length - 1 === questionIndex ? <button
                  type="button"
                  onClick={ () => { setSubmitTest(true) } }
                  className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg cursor-pointer"
                >
                  SUBMIT
                </button> : <button
                  type="button"
                  disabled={ disableNextBtn }
                  onClick={ onNextClicked }
                  className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
                >
                  NEXT<FaArrowRight className="ml-2" />
                </button> }
              </div>
            </div>
          </div>
        </div>
      </div>
      { submitTest ? <ModuleConfirmationModal onPress={ (v) => { onSubmission(v) } } /> : null }
    </>
  );
}

export default StartMCQTest;
