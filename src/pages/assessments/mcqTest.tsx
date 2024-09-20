import { useParams } from "react-router-dom";
import UserIcon from "../../assets/svg/userIcon.svg";
import QuestionNumberBox from "../../components/questionNumberBox";
import QuestionOptionBox from "../../components/displayQuestionOptions";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import React, { memo, useEffect, useRef, useState } from "react";
import { useNetworkState } from 'react-use';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getAssessmentsSelector,
} from "../../store/slices/dashboard-slice/dashboard-selectors";
import {
  getModuleSubmissionDispatcher,
  getUserActivityDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";
import ReviewIcon from "../../assets/svg/review.svg";
import ReviewedIcon from "../../assets/svg/reviewed.svg";
import ExitFullScreenModal from "../../components/Modals/exitFullScreen";
import screenfull from "screenfull";
import CustomToaster from "../../components/Modals/CustomToaster";
import InternetModal from "../../components/Modals/internetModal";
import FaceDetectionComponent from "../../components/faceDetection";
import ModuleTimeoutModal from "../../components/Modals/timeoutModal";
import moment from "moment";
import TabChangeDetectionModal from "../../components/Modals/tabChangeDetected";
import { ReactSVG } from "react-svg";

function StartMCQTest () {
  const dispatcher = useAppDispatch();
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([]);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedQuestion, setSelectedQuestion] = React.useState("");
  const [disableNextBtn, setDisableNextBtn] = React.useState(false);
  const [submitTest, setSubmitTest] = React.useState(false);
  const [disablePrevBtn, setDisablePrevBtn] = React.useState(true);
  const [isExitFullScreen, setIsExitFullScreen] = React.useState(false);
  const { assessmentId, testId, userId } = useParams();
  const [cameraReady, setCameraReady] = useState(false);
  const [moduleTime, setModuleTime] = useState(0);
  const [togglePopup, setTogglePopup] = useState(false);
  const [assessmentModule, setAssessmentModule] = useState<any>({})
  const [networkChecking, setNetworkChecking] = React.useState(false);
  const [isTimeout, setIsTimeout] = React.useState(false);
  const [tabSwitchDetected, setTabSwitchDetected] = React.useState(false);
  const prevFaceDataRef: any = useRef();
  const toggleRef: any = useRef();

  let toasterTimeout: any = null;
  const state = useNetworkState();
  let internetTimer: any = null
  useUserActivityDetection();

  useEffect(() => {
    if (state) {
      checkInternet(state?.online)
    }
  }, [state]);

  const checkInternet = (isInternet: any) => {
    clearTimeout(internetTimer)
    if (isInternet) {
      setNetworkChecking(false)
    } else {
      setNetworkChecking(true)
      internetTimer = setTimeout(() => {
        goBack()
      }, 200000);
    }
  }

  const updateUserActivity = (type: string) => {
    dispatcher(getUserActivityDispatcher({
      candidateId: userId,
      type: type
    }));
  }

  function handleVisibilityChange () {
    if (document?.hidden) {
      updateUserActivity("tabChangeDetected")
      setTabSwitchDetected(true)
    }
  }
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e?.preventDefault();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    const res = sessionStorage.getItem(`${testId}-${userId}`)
    const time = sessionStorage.getItem(`txp-${testId}-${userId}`)
    if (res) {
      const assessmentTestData: any = JSON.parse(decodeURIComponent(escape(atob(res))))
      console.log('assessmentTestData=>', assessmentTestData)
      setAssessmentModule(assessmentTestData)
      if (assessmentTestData?.module?.question) {
        const questions = assessmentTestData?.module?.question?.map((v: any) => {
          return { ...v, answer: "" };
        });
        setModuleQuestions(questions);
        setQuestionIndex(0);
      }
    } else {
      setTimeout(() => {
        goBack()
      }, 0);
    }
    if (time) {
      setModuleTime(Number(time))
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setCameraReady(true);
    }, 4000);
    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleFullscreenChange);
      }
    };
  }, []);
  useEffect(() => {
    if (screenfull.isEnabled && !screenfull.isFullscreen) {
      checkScreenExit()
    }
  }, [screenfull, screenfull.isFullscreen, screenfull.isEnabled]);
  const checkScreenExit = () => {
    const time = sessionStorage.getItem("screen-exit-time")
    if (time) {
      const seconds = moment().diff(moment(time), 'seconds')
      if (seconds > 2) {
        setIsExitFullScreen(true);
        updateUserActivity("exitFullScreen")
      }
    }
  }
  const handleFullscreenChange = () => {
    if (!screenfull.isFullscreen) {
      setIsExitFullScreen(true);
      updateUserActivity("exitFullScreen")
    }
  };
  const fullScreenElev: any = document.getElementById("fullscreenDiv");
  const onExitAction = (type: any) => {
    if (type === "cancel") {
      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        screenfull.request(fullScreenElev);
      }
    }
    if (type === "exit") {
      submitTestClicked("");
    }
    setIsExitFullScreen(false);
  };

  const onQuestionSelection = (option: any, optionIndex: number) => {
    let optionValue = "";
    let updateQuestion = [...moduleQuestions];
    let index = -1
    if (option !== selectedQuestion || updateQuestion?.[questionIndex]?.selectedOptionIndex !== optionIndex) {
      optionValue = option;
      index = optionIndex
    }
    updateQuestion[questionIndex] = {
      ...updateQuestion[questionIndex],
      answer: optionValue,
      selectedOptionIndex: index
    };
    setModuleQuestions(updateQuestion);
    setSelectedQuestion(optionValue);
  };

  const onPrevClicked = () => {
    if (questionIndex - 1 === 0) {
      setDisablePrevBtn(true);
    } else {
      setDisablePrevBtn(false);
    }
    if (questionIndex) {
      setSelectedQuestion(
        moduleQuestions?.[questionIndex - 1 === 0 ? 0 : questionIndex - 1]
          ?.answer || ""
      );
      setQuestionIndex((prev) => {
        return prev - 1;
      });
    }
    setDisableNextBtn(false);
  };

  const onNextClicked = () => {
    if (moduleQuestions?.length - 2 === questionIndex) {
      setDisableNextBtn(true);
    } else {
      setDisableNextBtn(false);
    }
    if (moduleQuestions?.length - 1 > questionIndex) {
      setSelectedQuestion(
        moduleQuestions?.[
          moduleQuestions?.length - 1 === questionIndex ? 0 : questionIndex + 1
        ]?.answer || ""
      );
      setQuestionIndex((prev) => {
        return prev + 1;
      });
    }
    setDisablePrevBtn(false);
  };

  const directQuestionClicked = (index: number) => {
    setSelectedQuestion(moduleQuestions?.[index - 1]?.answer || "");
    setQuestionIndex(index - 1);
    if (index === moduleQuestions?.length) {
      setDisableNextBtn(true);
    } else {
      setDisableNextBtn(false);
    }
    if (index === 1) {
      setDisablePrevBtn(true);
    } else {
      setDisablePrevBtn(false);
    }
  };

  const onSubmission = (type: string) => {
    if (type === "submit") {
      submitTestClicked("");
    }
    setSubmitTest(false);
  };

  const submitTestClicked = async (type: string) => {
    try {
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          question: moduleQuestions,
        })
      );
      if (res?.payload.data?.status) {
        toast.success(
          `${assessmentModule?.module?.name} completed successfully!`,
          {}
        );
        if (type === "auto") {
          setIsTimeout(true)
        } else {
          goBack()
        }
      } else {
        toast.error("Oops! Submission is failed", {});
      }
    } catch (error) {
      console.log("error=>", error);
      toast.error("Oops! Internal server error", {});
    }
  };

  const clearStoredSession = () => {
    sessionStorage.setItem(`${testId}-${userId}`, "")
    sessionStorage.setItem(`txp-${testId}-${userId}`, "0")
    sessionStorage.setItem("screen-exit-time", "")
  }

  const onTimeout = () => {
    if (Number(assessmentModule?.module?.time) > 0) {
      submitTestClicked("auto");
    }
  };

  const onReview = () => {
    let updateQuestion = [...moduleQuestions];
    updateQuestion[questionIndex] = {
      ...updateQuestion[questionIndex],
      review: !updateQuestion[questionIndex]?.review,
    };
    setModuleQuestions(updateQuestion);
  };
  const onRefChange = (flag: any, msg: string) => {
    prevFaceDataRef.current = msg
    toggleRef.current = flag;
    setTogglePopup(flag)
  }
  const onCloseTimeout = () => {
    setIsTimeout(false)
    goBack()
  }
  const goBack = () => {
    clearStoredSession()
    window.location.replace(`/candidate/assessment/${userId}/${assessmentId}/modules`)
  }
  return (
    <>
      <div className="md:px-20 md:pt-12 px-4">
        { togglePopup && (
          <CustomToaster
            message={ prevFaceDataRef?.current }
            onClose={ () => {
              toggleRef.current = false;
              setTogglePopup(false)
            } }
          />
        ) }
        <TimerCounterWithProgress
          timestamp={ moduleTime || 0 }
          title={ assessmentModule?.module?.name }
          onTimeout={ () => onTimeout() }
        />
        <div className="flex md:flex-row flex-col font-sansation mt-10">
          <div className="basis-[30%] w-full md:mr-12">
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <div className="flex flex-row items-center mx-6 py-5 border-solid border-b-[3px] border-[#E6E6E6]">
                <ReactSVG
                  className="w-16 h-16 rounded-full shadow-lg mb-3"
                  src={ UserIcon }
                />
                <h5 className="text-[24px] font-medium text-black ml-5 capitalize">
                  { myAssessments && myAssessments?.[0]?.name }
                </h5>
              </div>
              <div className="flex flex-col mx-8 pt-4">
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
                  <div className="w-[12px] h-[12px] rounded-full border-[#CC484E] bg-[#CC484E] border-solid border-[2px]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Review
                  </h5>
                </div>
                <div className=" flex flex-wrap w-full gap-5 my-5 max-h-72 overflow-y-scroll">
                  { moduleQuestions?.map((question: any, index: number) => (
                    <QuestionNumberBox
                      questionNo={ index + 1 }
                      checked={ question?.answer }
                      key={ question?._id }
                      review={ question?.review }
                      directQuestionClicked={ (no: any) => directQuestionClicked(no) }
                    />
                  )) }
                </div>
              </div>
              <button
                type="button"
                onClick={ () => {
                  setSubmitTest(true);
                } }
                className={ `flex w-full text-white bg-[#31B06B] tracking-wide font-semibold text-md px-12 py-2.5 text-center justify-center items-center font-sansation cursor-pointer` }
              >
                Submit
              </button>
            </div>
          </div>
          <FaceDetectionComponent onRefChange={ (v: any, msg: string) => { onRefChange(v, msg) } } />
          <div className="basis-[70%] relative md:border-l-[2px] md:border-[#DCDCD9]">
            <div className="mcq-q pb-44">
              <div className="md:px-12 px-6 md:pt-0 pt-6">
                <div className="flex">
                  <div>
                    <h5 className="text-[22px] font-normal text-black select-none">
                      Q{ questionIndex + 1 }.
                    </h5>
                  </div>
                  <div className="mr-8">
                    <h5 className="text-[22px] font-normal text-black pl-[10px] select-none">
                      { moduleQuestions?.[questionIndex]?.title || "" }
                    </h5>
                  </div>
                  <div onClick={ () => onReview() } className=" absolute -top-1 right-2">
                    { moduleQuestions?.[questionIndex]?.review ? (
                      <ReactSVG src={ ReviewedIcon } />
                    ) : (
                      <ReactSVG src={ ReviewIcon } />
                    ) }
                  </div>
                </div>
                <div className="space-y-5 mt-6 ml-10">
                  { moduleQuestions?.[questionIndex]?.options?.map(
                    (option: any, index: number) => (
                      <QuestionOptionBox
                        key={ `${option}-${index}-${questionIndex}` }
                        onSelection={ (v: any) => {
                          onQuestionSelection(v, index);
                        } }
                        option={ option }
                        index={ index }
                        checked={ moduleQuestions?.[questionIndex]?.selectedOptionIndex === index ? selectedQuestion : "" }
                      />
                    )
                  ) }
                </div>
              </div>
            </div>
            <div className="w-full absolute bottom-0 left-0 right-0 bg-[#F9F7F0] pb-6 pt-6">
              <div className="flex w-full md:justify-between md:flex-row flex-col justify-center items-center md:gap-0 gap-4">
                <button
                  type="button"
                  disabled={ disablePrevBtn }
                  onClick={ () => onPrevClicked() }
                  className={ `md:mx-20 mx-6 flex text-white font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg ${disablePrevBtn ? "cursor-not-allowed bg-[#CC8448]/50" : "bg-[#CC8448]"
                    }` }
                >
                  <FaArrowLeft className="mr-2" />
                  PREVIOUS
                </button>
                { moduleQuestions?.length - 1 === questionIndex ? (
                  <button
                    type="button"
                    onClick={ () => {
                      setSubmitTest(true);
                    } }
                    className="md:mx-20 mx-6 flex text-white bg-[#31B06B] font-semibold text-md w-40 py-2.5 text-center justify-center items-center rounded-lg cursor-pointer"
                  >
                    SUBMIT
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={ disableNextBtn }
                    onClick={ () => onNextClicked() }
                    className="md:mx-20 mx-6 flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg"
                  >
                    NEXT
                    <FaArrowRight className="ml-2" />
                  </button>
                ) }
              </div>
            </div>
          </div>
        </div>
      </div>
      { submitTest ? (
        <ModuleConfirmationModal
          onPress={ (v) => {
            onSubmission(v);
          } }
          title={ assessmentModule?.module?.name }
        />
      ) : null }
      { isExitFullScreen ? (
        <ExitFullScreenModal
          onPress={ (v) => {
            onExitAction(v);
          } }
        />
      ) : null }
      { networkChecking && <InternetModal /> }
      { isTimeout && <ModuleTimeoutModal onClose={ () => { onCloseTimeout() } } /> }
      { tabSwitchDetected && <TabChangeDetectionModal onPress={ () => { setTabSwitchDetected(false) } } /> }
    </>
  );
}

export default memo(StartMCQTest);
