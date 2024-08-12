import VoiceIcon from "../../assets/Group 171.png";
import MicIcon from "../../assets/svg/micIcon2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Webcam from "react-webcam";
import { useNetworkState } from 'react-use';
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import { v4 as uuidv4 } from "uuid";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getAssessmentModuleSelector,
  getAssessmentsSelector,
} from "../../store/slices/dashboard-slice/dashboard-selectors";
import {
  getModuleSubmissionDispatcher,
  getUserActivityDispatcher,
  setAssessmentModuleDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";
import ExitFullScreenModal from "../../components/Modals/exitFullScreen";
import screenfull from "screenfull";
import InternetModal from "../../components/Modals/internetModal";
import ModuleTimeoutModal from "../../components/Modals/timeoutModal";
import moment from "moment";
import TabChangeDetectionModal from "../../components/Modals/tabChangeDetected";
import { ReactSVG } from "react-svg";
import { detectBrowser } from "../../utils";
import QuickStartModal from "../../components/Modals/quickStartModal";

const VoiceToVoice = () => {
  const webcamRef = useRef<any>(null);
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const chatEndRef: any = useRef(null);
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const dispatcher = useAppDispatch();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // console.log('myAssessments=>', myAssessments)
  // const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [submitTestModal, setSubmitTestModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [userMute, setUserMute] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExitFullScreen, setIsExitFullScreen] = useState(false);
  const [question, setQuestion] = useState({
    title: "",
    answer: "",
  });
  const [conversationAns, setConversationAns] = useState<string>("");
  const [moduleQuestions, setModuleQuestions] = useState<any>([]);
  const [aiChats, setAIChat] = useState<any>([]);
  const [networkChecking, setNetworkChecking] = useState(false);
  const [assessmentModule, setAssessmentModule] = useState<any>({})
  const [isTimeout, setIsTimeout] = useState(false);
  const [moduleTime, setModuleTime] = useState(0);
  const [tabSwitchDetected, setTabSwitchDetected] = useState(false);
  const [quickStartInSafari, setQuickStartInSafari] = useState(true);
  let streamRef: any = useRef(null);
  useUserActivityDetection();
  let audioElement = useRef(new Audio());

  let speakTimeout: any = null;
  const state = useNetworkState();
  let internetTimer: any = null

  useEffect(() => {
    scrollToBottom();
  }, [aiChats]);

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

  const updateUserActivity = (type: string) => {
    dispatcher(
      getUserActivityDispatcher({
        candidateId: userId,
        type: type
      })
    );
  };


  useEffect(() => {
    if (state) {
      checkInternet(state?.online)
    }
    return () => {
      clearStoredSession()
    }
  }, [state]);

  const clearStoredSession = () => {
    sessionStorage.setItem(`${testId}-${userId}`, "")
    sessionStorage.setItem(`txp-${testId}-${userId}`, "0")
    sessionStorage.setItem("screen-exit-time", "")
  }

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

  // useEffect(() => {
  //   if (assessmentModule?.module?.question) {
  //     const questions = assessmentModule?.module?.question?.map((v: any) => {
  //       return { ...v, answer: v?.answer ? v?.answer : "" };
  //     });
  //     setModuleQuestions(questions);
  //   }
  // }, [assessmentModule]);

  useEffect(() => {
    const res = sessionStorage.getItem(`${testId}-${userId}`)
    const time = sessionStorage.getItem(`txp-${testId}-${userId}`)
    if (res) {
      const assessmentTestData: any = JSON.parse(decodeURIComponent(escape(atob(res))))
      console.log('assessmentTestData=>', assessmentTestData)
      setAssessmentModule(assessmentTestData)
      if (assessmentTestData?.module?.question) {
        const questions = assessmentTestData?.module?.question?.map((v: any) => {
          return { ...v, answer: v?.answer ? v?.answer : "" };
        });
        setModuleQuestions(questions);
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
      checkScreenExit();
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
      submitTest("");
    }
    setIsExitFullScreen(false);
  };

  // useEffect(() => {
  //   dispatcher(
  //     setAssessmentModuleDispatcher({
  //       moduleId: testId,
  //       candidateId: userId,
  //       assessmentId: assessmentId,
  //     })
  //   );
  // }, [dispatcher, assessmentId, testId, userId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setQuickStartInSafari(detectBrowser() === "Safari")
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        setMediaRecorder(
          new MediaRecorder(stream, { mimeType: detectBrowser() === "Safari" ? "audio/mp4" : "audio/webm; codecs=opus" })
        );
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone. Please check your permissions.");
      });
  }, []);

  useEffect(() => {
    if (mediaRecorder && userId && moduleQuestions && myAssessments && !quickStartInSafari) {
      const newSocket = io("wss://talorexvoice.com", {
        query: {
          userId: userId,
        },
      });
      console.log("socket id", newSocket.id);
      newSocket.on("connect", () => {
        console.log("connected to server", {
          title: moduleQuestions?.[0]?.title,
          name: myAssessments && myAssessments?.[0]?.name,
        });
        newSocket.emit("prompt", {
          title: moduleQuestions?.[0]?.title,
          name: myAssessments && myAssessments?.[0]?.name,
        });
        mediaRecorder.start(1500);
        mediaRecorder.ondataavailable = async (event) => {
          if (event?.data?.size > 0) {
            console.log("START AI");
            try {
              const arrayBuffer = await event.data.arrayBuffer();
              const base64String = arrayBufferToBase64(arrayBuffer);
              newSocket.emit("media", { payload: base64String });
            } catch (err) {
              console.error("Failed to encode audio:", err);
              setError("Failed to encode audio.");
            }
          }
        };
        newSocket.emit("start", { streamSid: newSocket.id, callSid: uuidv4() });
      });
      newSocket.on("question", (data) => {
        console.log("conversationAns question=>", data);
        setQuestion({ ...question, ...data });
        setAIChat((prev: any) => {
          return [...prev, { type: "ai", text: data?.title }];
        });
        setConversationAns((prev) => {
          return prev + `AI:${data?.title} `;
        });
      });
      newSocket.on("answer", (data) => {
        setIsSpeaking(2);
        console.log("conversationAns answer=>", data);
        audioElement.current.pause();
        audioElement.current.currentTime = 0;
        setIsPlaying(true);
        setAIChat((prev: any) => {
          return [...prev, { type: "user", text: data?.answer }];
        });
        setConversationAns((prev) => {
          return prev + `User:${data?.answer} `;
        });
      });

      newSocket.on("audioData", (data) => {
        const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob);
        clearTimeout(speakTimeout);
        setIsSpeaking(1);
        audioElement?.current?.pause();
        audioElement.current.currentTime = 0;
        audioElement.current.src = "";
        speakTimeout = setTimeout(() => {
          audioElement.current.src = audioUrl;
          setIsPlaying(true);
          audioElement?.current?.play();
        }, 200);
        audioElement.current.onended = () => {
          setIsSpeaking(0);
          setIsPlaying(false);
        };
      });

      newSocket.on("disconnect", () => {
        console.log("socket: disconnected from server");
      });

      newSocket.on("error", (error: string) => {
        console.error("WebSocket error:", error);
        setError("A WebSocket error occurred.");
      });
      return () => {
        mediaRecorder?.stop();
        audioElement?.current?.pause();
        audioElement.current.currentTime = 0;
        mediaRecorder.removeEventListener("dataavailable", () => { });
        newSocket?.disconnect();
      };
    }
  }, [mediaRecorder, userId, moduleQuestions, myAssessments, quickStartInSafari]);

  function arrayBufferToBase64 (buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const base64ToBlob = (base64: string, type: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type });
  };

  useEffect(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      if (isRecording) {
        mediaRecorder.resume();
      } else {
        mediaRecorder.pause();
      }
    }
  }, [isRecording, mediaRecorder]);

  const onTimeout = () => {
    if (Number(assessmentModule?.module?.time) > 0) {
      submitTest("auto");
    }
  };

  const onSubmitTest = (type: string) => {
    setSubmitTestModal(false);
    if (type === "submit") {
      submitTest("");
    }
  };

  const submitTest = async (type: string) => {
    try {
      if (streamRef?.current) {
        streamRef.current?.getTracks()?.forEach((track: any) => track?.stop());
        streamRef.current = null;
      }
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      clearTimeout(speakTimeout);
      audioElement?.current?.pause();
      audioElement.current.currentTime = 0;
      audioElement.current.src = "";
      setIsSpeaking(0);
      mediaRecorder?.stop();
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          question: [{ ...moduleQuestions?.[0], answer: conversationAns }],
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
      toast.error("Oops! Internal server error", {});
      console.log("error=>", error);
    }
  };
  const onCloseTimeout = () => {
    setIsTimeout(false)
    goBack()
  }

  const goBack = () => {
    clearStoredSession()
    window.location.replace(`/assessment/${userId}/${assessmentId}/modules`)
  }

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <TimerCounterWithProgress
        timestamp={ moduleTime || 0 }
        title={ "Voice Round" }
        onTimeout={ () => onTimeout() }
      />
      <div className="flex">
        <span className="text-[20px] text-black font-sansation font-semibold">
          TALBot is your interviewer, please listen carefully and respond to the
          questions asked by TALBot
        </span>
      </div>
      {/* <div className="flex mb-3">
        <span className="text-[32px] font-semibold font-sansation text-[#CC8448]">
          Case Study
        </span>
      </div> */}
      <div className="flex md:flex-row flex-col md:justify-center mt-16">
        <div className="flex flex-col w-[80%] h-1/2 md:flex-row justify-between">
          <div className="relative flex w-[50%] h-[470px] bg-[#474646] justify-center items-center rounded-xl border border-[#E5A971] mr-4">
            <div className="flex justify-center items-center">
              <div
                className={ `h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center ${isSpeaking === 1 ? "animation-pulse" : ""
                  }` }
              >
                Ai
              </div>
            </div>
            <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
              Ai Bot
            </div>
            <div className="absolute right-2 bottom-4 text-white  px-4 py-1  ">
              <ReactSVG src={ MicIcon } className="h-8 w-10" />
            </div>
          </div>
          <div className="relative flex w-[50%] h-[470px] bg-[#E5A971] justify-center items-center rounded-xl border border-[#E5A971] mr-4">
            <div className="flex justify-center items-center">
              <div
                className={ `h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center capitalize ${isSpeaking === 2 ? "animation-pulse" : ""
                  }` }
              >
                { myAssessments && myAssessments?.[0]?.name
                  ? myAssessments?.[0]?.name?.substring(0, 1)
                  : "" }
              </div>
            </div>
            <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation capitalize">
              { (myAssessments && myAssessments?.[0]?.name) || "Candidate" }
            </div>
            <div className="absolute right-2 bottom-4 text-white  px-4 py-1  ">
              <ReactSVG src={ MicIcon } className="h-8 w-10" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[20%] bg-white shadow rounded-lg p-4">
          <div className="flex w-full flex-col h-[440px]">
            <div className="flex gap-2 px-2 pb-2">
              <img src={ VoiceIcon } />
              <span className="text-xs text-gray-300 mt-2">CC/Subtitle </span>
            </div>
            <div className="flex flex-col mx-2 bg-white overflow-y-scroll space-y-2">
              { Array.from(
                new Map(aiChats?.map((itm: any) => [itm?.text, itm])).values()
              )?.map((item: any, index: number) => {
                if (item?.type === "ai") {
                  return (
                    <div
                      key={ item?.text + index }
                      className="flex flex-col gap-1 w-full max-w-[80%]"
                    >
                      <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-[#F5F2F2] rounded-xl">
                        <p className="text-sm font-normal text-gray-900">
                          { item?.text }
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={ item?.text + index } className="flex justify-end">
                      <div className="bg-[#F5F2F2] text-black p-2 rounded-lg max-w-[80%]">
                        { item?.text }
                      </div>
                    </div>
                  );
                }
              }) }
              <div ref={ chatEndRef } />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end py-6 mt-4 font-sansation">
        <button
          className="flex justify-center bg-[#40B24B] px-12 py-2 rounded-lg text-white font-semibold font-sansation"
          onClick={ () => {
            setSubmitTestModal(true);
          } }
        >
          Submit
        </button>
      </div>
      { submitTestModal ? (
        <ModuleConfirmationModal
          onPress={ (v) => {
            onSubmitTest(v);
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
      { quickStartInSafari && <QuickStartModal onClose={ () => { setQuickStartInSafari(false) } } /> }
    </div>
  );
};

export default VoiceToVoice;
