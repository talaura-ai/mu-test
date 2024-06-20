import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import ModuletestStartModal from "../../components/Modals/testStartModal";
import {
  getModuleSubmissionDispatcher,
  setAssessmentModuleDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { toast } from "react-toastify";

const VoiceToText = () => {
  const dispatcher = useAppDispatch();
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([]);
  const [startTest, setStartTest] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<any>(0);
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);

  console.log("assessmentModule---TEXT", assessmentModule);

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      setModuleQuestions(assessmentModule?.module?.question);
    }
  }, [assessmentModule]);

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
    utterance.rate = 1; // Speed of speech
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
    console.log(i + 1, moduleQuestions?.length - 1);
    const index = i + 1;
    if (index < moduleQuestions?.length) {
      playText(moduleQuestions?.[index]?.title);
      setCurrentIndex((prev: any) => index);
    } else {
      console.log("RREEE", index, moduleQuestions?.length);
      if (moduleQuestions?.length > 0) {
        submitTest();
      }
    }
  };

  const onChange = (e: any) => {
    let questions = [...moduleQuestions];
    questions[currentIndex] = {
      ...questions[currentIndex],
      answer: e.target.value,
    };
    setModuleQuestions(questions);
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
        toast.success(`${assessmentModule?.module?.name} completed successfully!`, {});
        navigate(-1)
      } else {
        toast.error("Oops! Failed", {});
      }
    } catch (error) {
      toast.error("Oops! Internal server error", {});
      console.log("error=>", error);
    }
  };

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4 bg-[#F9F7F0] h-screen">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-4 border-b-2 border-[#7d7c78] pb-4 font-sansation">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            { assessmentModule?.module?.name }
          </span>
        </div>
      </div>

      <div className="flex items-start justify-start flex-col w-[100%]  md:px-10  h-[100%] ">
        <div className="flex">
          <span className="text-md text-black">
            The AI will pose the question out loud, and the candidate must
            provide a typed response.
          </span>
        </div>
        <div className="flex my-4">
          <span className="text-[40px] font-semibold font-sansation text-[#CC8448] border-b-4 border-[#CC8448]">
            Case Study
          </span>
        </div>

        <div className="flex justify-between items-center  flex-col  md:flex-row w-full gap-4 p-2 md:h-2/3  h-full">
          <div className="flex md:w-2/5 w-full   h-[280px] md:h-full bg-[#474646] justify-center items-center rounded border border-[#E5A971]">
            <div className="flex bg-white  h-10 w-10 md:h-40 md:w-40 rounded-full justify-center items-center">
              <span className="text-[#E5A971]  text-[20px] md:text-[60px] font-semibold font-sansation">
                Ai{ " " }
              </span>
            </div>
          </div>
          <div className="flex md:w-3/5 w-full  h-full justify-center items-center rounded bg-white">
            <div className="w-full  h-full  flex  overflow-hidden">
              <textarea
                className="bg-gray-100 w-full h-full rounded-lg p-4"
                placeholder="Write your answer here..."
                onChange={ (v) => {
                  onChange(v);
                } }
                value={ moduleQuestions?.[currentIndex]?.answer || "" }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6  px-10 w-3/5 self-end">
          <button
            onClick={ () => {
              submitTest();
            } }
            type="button"
            className="font-sansation text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center"
          >
            Submit Test
          </button>
          <button
            onClick={ () => {
              onNextClicked(currentIndex);
            } }
            disabled={ isSpeaking }
            type="button"
            className={ `font-sansation text-white hover:bg-[#CC8448]/80 ${isSpeaking ? "bg-[#CC8448]/60" : "bg-[#CC8448]"} focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center` }
          >
            Next
          </button>
        </div>
      </div>

      { startTest ? (
        <ModuletestStartModal
          onPress={ (v) => {
            onSubmission(v);
          } }
        />
      ) : null }
    </div>
  );
};

export default VoiceToText;
