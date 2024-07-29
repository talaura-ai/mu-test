import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import {
  getModuleSubmissionDispatcher,
  setAssessmentModuleDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";
import ExitFullScreenModal from "../../components/Modals/exitFullScreen";
import screenfull from "screenfull";

const VoiceToText = () => {
  const dispatcher = useAppDispatch();
  const { assessmentId, testId, userId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([]);
  const [currentIndex, setCurrentIndex] = React.useState<any>(0);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const [submitTestModal, setSubmitTestModal] = React.useState(false);
  const [isExitFullScreen, setIsExitFullScreen] = React.useState(false);
  const [disableNextBtn, setDisableNextBtn] = React.useState(false);
  const [disablePrevBtn, setDisablePrevBtn] = React.useState(true);
  useUserActivityDetection();
  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      const questions = assessmentModule?.module?.question?.map((v: any) => {
        return { ...v, answer: v?.answer ? v?.answer : "" };
      });
      setModuleQuestions(questions);
      if (
        assessmentModule?.module?.question?.length &&
        assessmentModule?.module?.question?.[0]?.answer
      ) {
        setEditorState(
          getEditorData(assessmentModule?.module?.question?.[0]?.answer)
        );
      }
    }
  }, [assessmentModule]);

  const getEditorData = (data: any) => {
    const blocksFromHTML = convertFromHTML(data);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(contentState);
  };

  React.useEffect(() => {
    dispatcher(
      setAssessmentModuleDispatcher({
        moduleId: testId,
        candidateId: userId,
        assessmentId: assessmentId,
      })
    );
  }, [dispatcher, assessmentId, testId, userId]);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleFullscreenChange);
      }
    };
  }, []);

  const handleFullscreenChange = () => {
    if (!screenfull.isFullscreen) {
      setIsExitFullScreen(true);
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
      submitTest();
    }
    setIsExitFullScreen(false);
  };

  const onPrevClicked = () => {
    if (currentIndex - 1 === 0) {
      setDisablePrevBtn(true);
    } else {
      setDisablePrevBtn(false);
    }
    if (currentIndex) {
      if (moduleQuestions?.[currentIndex - 1 === 0 ? 0 : currentIndex - 1]?.answer) {
        setEditorState(getEditorData(moduleQuestions?.[currentIndex - 1 === 0 ? 0 : currentIndex - 1]?.answer));
      } else {
        setEditorState(EditorState.createEmpty());
      }
      setCurrentIndex((prev: any) => {
        return prev - 1;
      });
    }
  };

  const onNextClicked = () => {
    const index = currentIndex + 1;
    if (index < moduleQuestions?.length) {
      setCurrentIndex((prev: any) => index);
      if (moduleQuestions?.[index]?.answer) {
        setEditorState(getEditorData(moduleQuestions?.[index]?.answer));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } else {
      if (moduleQuestions?.length > 0) {
        // submitTest();
      }
    }
    setDisablePrevBtn(false);
  };

  const submitTest = async () => {
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
        // navigate(-1)
        // screenfull.exit()
        window.location.href = `/assessment/${userId}/${assessmentId}/modules`;
      } else {
        toast.error("Oops! Submission is failed", {});
      }
    } catch (error) {
      toast.error("Oops! Internal server error", {});
      console.log("error=>", error);
    }
  };

  const onSubmitTest = (type: string) => {
    setSubmitTestModal(false);
    if (type === "submit") {
      submitTest();
    }
  };

  const onTimeout = () => {
    if (Number(assessmentModule.module?.time) > 0) {
      submitTest();
    }
  };

  const onEditorStateChange = (stats: any) => {
    setEditorState(stats);
    let questions = [...moduleQuestions];
    questions[currentIndex] = {
      ...questions[currentIndex],
      answer: draftToHtml(convertToRaw(stats.getCurrentContent())),
    };
    setModuleQuestions(questions);
  };

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <TimerCounterWithProgress
        timestamp={ assessmentModule.module?.time || 0 }
        title={ assessmentModule.module?.name }
        onTimeout={ onTimeout }
      />
      <div className="flex items-start justify-start flex-col w-[100%] h-[100%] ">
        <div className="flex">
          <span className="text-[20px] text-black font-sansation font-semibold">
            The AI will pose the question{ " " }
            <span className="text-[#CC484E]">only once, </span>candidate please
            share your response in the provided text box.
          </span>
        </div>
        <div className="flex justify-between flex-col md:flex-row w-full gap-4 p-2 h-[500px] mt-14">
          <div className="flex md:w-2/5 w-full h-full rounded-xl bg-white">
            <div className="w-full flex-col rounded-xl relative">
              <div className="flex w-full px-5 py-3 border-b border-[#DCDCD9]">
                <h5 className="text-[22px] text-[#CC8448] select-none font-semibold">
                  Question { currentIndex + 1 }
                </h5>
              </div>
              <div className="flex p-4 overflow-y-scroll overflow-x-hidden h-[400px]">
                <h5 className="text-[22px] font-normal text-black pl-[10px] select-none">
                  { moduleQuestions?.[currentIndex]?.title }
                </h5>
              </div>
            </div>
          </div>
          <div className="flex md:w-3/5 w-full h-full rounded-xl bg-white">
            <div className="w-full flex overflow-hidden rounded-xl">
              <Editor
                editorState={ editorState }
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                wrapperStyle={ { width: "100%" } }
                editorStyle={ {
                  paddingLeft: 20,
                  paddingRight: 20,
                  width: "100%",
                } }
                onEditorStateChange={ onEditorStateChange }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-6 px-2 w-full">
          <button
            type="button"
            disabled={ disablePrevBtn }
            onClick={ () => onPrevClicked() }
            className={ `flex text-white font-medium text-md w-40 py-2.5 text-center font-sansation justify-center items-center rounded-lg ${disablePrevBtn ? "cursor-not-allowed bg-[#CC8448]/50" : "bg-[#CC8448]"
              }` }
          >
            <FaArrowLeft className="mr-2" />
            PREVIOUS
          </button>
          { moduleQuestions?.length - 1 === currentIndex ? (
            <button
              onClick={ () => {
                setSubmitTestModal(true);
              } }
              type="button"
              className={ `font-sansation text-white hover:bg-[#40B24B]/80 bg-[#40B24B] focus:ring-4 focus:outline-none tracking-wide focus:ring-[#40B24B]/50 font-semibold rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center` }
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              disabled={ disableNextBtn }
              onClick={ () => onNextClicked() }
              className="flex text-white bg-[#CC8448] font-medium text-md w-40 py-2.5 text-center justify-center items-center rounded-lg font-sansation"
            >
              NEXT
              <FaArrowRight className="ml-2" />
            </button>
          ) }
        </div>
      </div>
      { submitTestModal ? (
        <ModuleConfirmationModal
          onPress={ (v) => {
            onSubmitTest(v);
          } }
          title={ assessmentModule.module?.name }
        />
      ) : null }
      { isExitFullScreen ? (
        <ExitFullScreenModal
          onPress={ (v) => {
            onExitAction(v);
          } }
        />
      ) : null }
    </div>
  );
};

export default VoiceToText;
