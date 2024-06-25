import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import ModuletestStartModal from "../../components/Modals/testStartModal";
import {
  getModuleSubmissionDispatcher,
  setAssessmentModuleDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { htmlToText } from 'html-to-text';
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";

const VoiceToText = () => {
  const dispatcher = useAppDispatch();
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([]);
  const [startTest, setStartTest] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<any>(0);
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
  const [submitTestModal, setSubmitTestModal] = React.useState(false)

  useUserActivityDetection()

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      const questions = assessmentModule?.module?.question?.map((v: any) => { return { ...v, answer: v?.answer ? v?.answer : "" } })
      setModuleQuestions(questions);
      if (assessmentModule?.module?.question?.length && assessmentModule?.module?.question?.[0]?.answer) {
        setEditorState(getEditorData(assessmentModule?.module?.question?.[0]?.answer))
      }
    }
  }, [assessmentModule]);

  const getEditorData = (data: any) => {
    const blocksFromHTML = convertFromHTML(data)
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )
    return EditorState.createWithContent(contentState)
  }

  React.useEffect(() => {
    dispatcher(
      setAssessmentModuleDispatcher({
        moduleId: testId,
        candidateId: userId,
        assessmentId: assessmentId,
      })
    );
  }, [dispatcher, assessmentId, testId, userId]);

  const onSubmission = (type: string) => {
    if (type === "start") {
      playText(moduleQuestions?.[currentIndex]?.title);
    } else {
      navigate(-1)
    }
    setStartTest(false);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setStartTest(true);
    }, 500);
    return () => {
      window?.speechSynthesis?.cancel?.();
      clearTimeout(timer)
    }
  }, []);

  const textToSpeech = (text: string) => {
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.6; // Speed of speech
    utterance.pitch = 1; // Pitch of the voice
    utterance.volume = 1; // Volume of the voice
    utterance.onend = () => {
      console.log("Speech synthesis finished.");
      setIsSpeaking(false)
    };
    window.speechSynthesis.speak(utterance);
  };

  const playText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("Text-to-Speech not supported in this browser.");
    } else {
      console.log("Text-to-Speech is supported in this browser.");
      textToSpeech(text);
    }
  };

  const onNextClicked = (i: any) => {
    const index = i + 1;
    if (index < moduleQuestions?.length) {
      playText(moduleQuestions?.[index]?.title);
      setCurrentIndex((prev: any) => index);
      if (moduleQuestions?.[index]?.answer) {
        setEditorState(getEditorData(moduleQuestions?.[index]?.answer))
      } else {
        setEditorState(EditorState.createEmpty())
      }
    } else {
      if (moduleQuestions?.length > 0) {
        submitTest();
      }
    }
  };
  const getAnswered = () => {
    return moduleQuestions?.map((v: any) => {
      if (v?.answer) {
        let text = htmlToText(v?.answer, {
          wordwrap: 130,
        })
        text = text?.replace(/\n/g, ' ')?.trim();
        text = text?.replace(/\s+/g, ' ')?.trim();
        return {
          ...v, answer: text
        }
      } else {
        return v
      }
    })
  }
  const submitTest = async () => {
    try {
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          question: getAnswered(),
        })
      );
      if (res?.payload.data?.status) {
        toast.success(`${assessmentModule?.module?.name} completed successfully!`, {});
        navigate(-1)
      } else {
        toast.error("Oops! Submission is failed", {});
      }
    } catch (error) {
      toast.error("Oops! Internal server error", {});
      console.log("error=>", error);
    }
  };

  const onSubmitTest = (type: string) => {
    setSubmitTestModal(false)
    if (type === "submit") {
      submitTest()
    }
  }

  const onTimeout = () => {
    if (Number(assessmentModule.module?.time) > 0) {
      submitTest()
    }
  }

  const onEditorStateChange = (stats: any) => {
    setEditorState(stats)
    let questions = [...moduleQuestions];
    questions[currentIndex] = {
      ...questions[currentIndex],
      answer: draftToHtml(convertToRaw(stats.getCurrentContent()))
    };
    setModuleQuestions(questions);
  };

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <TimerCounterWithProgress timestamp={ assessmentModule.module?.time || 0 } title={ assessmentModule.module?.name } onTimeout={ onTimeout } />
      <div className="flex items-start justify-start flex-col w-[100%] h-[100%] ">
        <div className="flex">
          <span className="text-md text-black">
            The AI will pose the question out loud, and the candidate must
            provide a typed response.
          </span>
        </div>
        <div className="flex mb-2">
          <span className="text-[32px] font-semibold font-sansation text-[#CC8448]">
            Case Study
          </span>
        </div>

        <div className="flex justify-between flex-col md:flex-row w-full gap-4 p-2 h-[500px]">
          <div className="flex md:w-2/5 w-full h-[500px] md:h-full bg-[#474646] justify-center items-center overflow-hidden border border-[#E5A971] rounded-xl">
            <div className="flex justify-center items-center">
              <div className={ `h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center ${isSpeaking ? "animation-pulse" : ""}` }>
                Ai
              </div>
            </div>
          </div>
          <div className="flex md:w-3/5 w-full h-full rounded-xl bg-white">
            <div className="w-full h-full flex overflow-hidden rounded-xl">
              <Editor
                editorState={ editorState }
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                wrapperStyle={ { width: "100%", overflow: 'hidden' } }
                editorStyle={ { paddingLeft: 20, paddingRight: 20, width: '100%', overflow: 'hidden' } }
                onEditorStateChange={ onEditorStateChange }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-6 px-2 w-3/5 self-end  ">
          <button
            onClick={ () => {
              setSubmitTestModal(true)
            } }
            type="button"
            className="font-sansation text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center"
          >
            Submit Test
          </button>
          { moduleQuestions?.length - 1 === currentIndex ? <button
            onClick={ () => {
              setSubmitTestModal(true)
            } }
            disabled={ isSpeaking }
            type="button"
            className={ `font-sansation text-white hover:bg-[#CC8448]/80 ${isSpeaking ? "bg-[#CC8448]/60" : "bg-[#CC8448]"} focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center` }
          >
            Submit
          </button> : <button
            onClick={ () => {
              onNextClicked(currentIndex);
            } }
            disabled={ isSpeaking }
            type="button"
            className={ `font-sansation text-white hover:bg-[#CC8448]/80 ${isSpeaking ? "bg-[#CC8448]/60" : "bg-[#CC8448]"} focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center` }
          >
            Next
          </button> }
        </div>
      </div>

      { startTest ? (
        <ModuletestStartModal
          onPress={ (v) => {
            onSubmission(v);
          } }
        />
      ) : null }
      { submitTestModal ? <ModuleConfirmationModal onPress={ (v) => { onSubmitTest(v) } } /> : null }
    </div>
  );
};

export default VoiceToText;
