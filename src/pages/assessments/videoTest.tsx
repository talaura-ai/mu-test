import VoiceIcon from "../../assets/Group 171.png";
import ReactLoading from 'react-loading';
import MicIcon from "../../assets/svg/micIcon2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector, getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { getModuleSubmissionDispatcher, getUserActivityDispatcher, setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";

const width = 650;
const height = 650;
const VideoTest = () => {
  // const webcamRef = useRef<any>(null);
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const chatEndRef: any = useRef(null);
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const dispatcher = useAppDispatch();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [submitTestModal, setSubmitTestModal] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [cameraStats, setCameraStats] = useState(0);
  const [userMute, setUserMute] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState({
    title: "",
    answer: ""
  });
  const [conversationAns, setConversationAns] = useState<string>("");
  const [moduleQuestions, setModuleQuestions] = useState<any>([]);
  const [aiChats, setAIChat] = useState<any>([]);

  useUserActivityDetection()

  let speakTimeout: any = null

  const { webcamRef, boundingBox, isLoading, detected, facesDetected }: any = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }: CameraOptions) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });
  useEffect(() => {
    console.log(detected, facesDetected)
    if (!detected) {
      const screenshot = webcamRef.current.getScreenshot();
      updateUserActivity()
    }
    if (facesDetected > 1) {
      updateUserActivity()
    }
  }, [detected, facesDetected])

  useEffect(() => {
    scrollToBottom();
  }, [aiChats]);

  useEffect(() => {
    if (assessmentModule?.module?.question) {
      const questions = assessmentModule?.module?.question?.map((v: any) => { return { ...v, answer: v?.answer ? v?.answer : "" } })
      setModuleQuestions(questions);
    }
  }, [assessmentModule]);

  useEffect(() => {
    dispatcher(
      setAssessmentModuleDispatcher({
        moduleId: testId,
        candidateId: userId,
        assessmentId: assessmentId,
      })
    );
  }, [dispatcher, assessmentId, testId, userId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // //Disable Right click
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }

  const updateUserActivity = () => {
    dispatcher(getUserActivityDispatcher({
      candidateId: userId,
    }));
  }

  // useEffect(() => {
  //   const handleBeforeUnload = (event: any) => {
  //     console.log('Browser Closing')
  //     // Here you can handle logic before the unload event
  //     const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
  //     event.returnValue = message; // Standard for most browsers

  //     return message; // For some older browsers
  //   };
  //   const handleUnload = () => {
  //     console.log('Page reloading')
  //     // Logic to handle page reload
  //     console.log('Page is being reloaded');
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   window.addEventListener('unload', handleUnload);
  //   // Clean up event listeners on component unmount
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     window.removeEventListener('unload', handleUnload);
  //   };
  // }, []);

  // // Alert on Tab Changed within the Same browser Window
  // function handleVisibilityChange () {
  //   if (document?.hidden) {
  //     console.log("Tab Change Detected", "Action has been Recorded", "error");
  //     // toast.error("Alert: Tab Change Detected", {});
  //     // the page is hidden
  //   } else {
  //     console.log("ACTIVE")
  //     // the page is visible
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setMediaRecorder(new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' }));
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone. Please check your permissions.");
      });
  }, []); // Setup mediaRecorder initially

  useEffect(() => {
    if (mediaRecorder && userId && moduleQuestions && myAssessments) {
      const audioElement = new Audio();
      const newSocket = io("wss://talorexvoice.com", {
        query: {
          userId: userId
        }
      });
      console.log("socket id", newSocket.id);
      newSocket.on("connect", () => {
        console.log("connected to server", { title: moduleQuestions?.[0]?.title, name: myAssessments && myAssessments?.[0]?.name });
        newSocket.emit("prompt", { title: moduleQuestions?.[0]?.title, name: myAssessments && myAssessments?.[0]?.name })
        mediaRecorder.start(500);
        mediaRecorder.ondataavailable = async (event) => {
          if (event?.data?.size > 0) {
            console.log('START AI')
            try {
              const arrayBuffer = await event.data.arrayBuffer();
              const base64String = arrayBufferToBase64(arrayBuffer);
              newSocket.emit("media", { payload: base64String });
              // audioElement?.pause();
              // audioElement.currentTime = 0;
            } catch (err) {
              console.error("Failed to encode audio:", err);
              setError("Failed to encode audio.");
            }
          }
        };
        newSocket.emit("start", { streamSid: newSocket.id, callSid: uuidv4() });
      });
      newSocket.on("question", (data) => {
        console.log('conversationAns question=>', data)
        setQuestion({ ...question, ...data });
        setAIChat((prev: any) => {
          return [...prev, { type: 'ai', text: data?.title }]
        })
        setConversationAns((prev) => {
          return prev + `AI:${data?.title} `
        })
      })
      newSocket.on('answer', (data) => {
        console.log('conversationAns answer=>', data)
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(true)
        setAIChat((prev: any) => {
          return [...prev, { type: 'user', text: data?.answer }]
        })
        setConversationAns((prev) => {
          return prev + `User:${data?.answer} `
        })
      })

      newSocket.on("audioData", (data) => {
        const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('audioUrl=>', audioUrl)
        clearTimeout(speakTimeout)
        setIsSpeaking(true)
        // if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.src = "";
        speakTimeout = setTimeout(() => {
          audioElement.src = audioUrl
          setIsPlaying(true)
          audioElement.play();
        }, 2000)
        // } else {
        //   audioElement.src = audioUrl
        //   setIsPlaying(true)
        //   audioElement.play();
        // }
        audioElement.onended = () => {
          setIsSpeaking(false)
          setIsPlaying(false)
        }
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
        audioElement?.pause();
        audioElement.currentTime = 0;
        mediaRecorder.removeEventListener("dataavailable", () => { });
        newSocket?.disconnect();
      };
    }
  }, [mediaRecorder, userId, moduleQuestions, myAssessments]);

  function arrayBufferToBase64 (buffer: ArrayBuffer): string {
    let binary = '';
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
    navigate(-1)
  }
  const videoConstraints = {
    facingMode: "user",
  };

  const onSubmitTest = (type: string) => {
    setSubmitTestModal(false)
    if (type === "submit") {
      submitTest()
    }
  }

  const submitTest = async () => {
    try {
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          question: [{ ...moduleQuestions?.[0], answer: conversationAns }]
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

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <TimerCounterWithProgress timestamp={ 20 || 0 } title={ "Video Round" } onTimeout={ onTimeout } />
      <div className="flex">
        <span className="text-md text-black">
          The AI will pose the question out loud, and the candidate must response.
        </span>
      </div>
      <div className="flex mb-3">
        <span className="text-[32px] font-semibold font-sansation text-[#CC8448]">
          Case Study
        </span>
      </div>
      <div className="flex md:flex-row flex-col md:justify-center">
        <div className="flex flex-col w-[80%] h-1/2 md:flex-row justify-between">
          <div className="relative flex w-[50%] h-[470px] bg-[#474646] justify-center items-center rounded-xl border border-[#E5A971] mr-4">
            <div className="flex justify-center items-center">
              <div className={ `h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center ${isSpeaking ? "animation-pulse" : ""}` }>
                Ai
              </div>
            </div>
            <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
              Ai Bot
            </div>
            <div className="absolute right-2 bottom-4 text-white  px-4 py-1  ">
              <img src={ MicIcon } className="h-8 w-10" alt="mic" />
            </div>
          </div>
          <div className="flex relative h-1/2 w-[50%] rounded-xl overflow-hidden">
            <div className="flex rounded-xl w-full overflow-hidden h-[470px]">
              <Webcam
                ref={ webcamRef }
                screenshotFormat="image/jpeg"
                screenshotQuality={ 1 }
                // audio={userMute}
                videoConstraints={ videoConstraints }
                onUserMedia={ () => { setCameraStats(1) } }
                onUserMediaError={ () => { setCameraStats(2) } }
                className="overflow-hidden rounded-xl bg-gray-200 mr-4 object-cover"
              />
              <div>
              </div>
              <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
                Manisha
              </div>
              <div className="absolute right-6 bottom-4 text-white  px-4 py-1  ">
                <img onClick={ () => { setUserMute(!userMute) } } src={ MicIcon } className="h-8 w-10" alt="mic" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[20%] bg-white shadow rounded-lg p-4">
          <div className="flex w-full flex-col h-[440px]">
            <div className="flex gap-2 px-2 pb-2">
              <img src={ VoiceIcon } alt="icn" />
              <span className="text-xs text-gray-300 mt-2">CC/Subtitle </span>
            </div>
            <div className="flex flex-col mx-2 bg-white overflow-y-scroll space-y-2">
              { aiChats?.map((item: any, index: number) => {
                if (item?.type === "ai") {
                  return (<div key={ item?.text + index } className="flex flex-col gap-1 w-full max-w-[80%]">
                    <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-[#F5F2F2] rounded-xl">
                      <p className="text-sm font-normal text-gray-900">{ item?.text }</p>
                    </div>
                  </div>)
                } else {
                  return (<div key={ item?.text + index } className="flex justify-end">
                    <div className="bg-[#F5F2F2] text-black p-2 rounded-lg max-w-[80%]">
                      { item?.text }
                    </div>
                  </div>)
                }
              }) }
              <div ref={ chatEndRef } />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-6 mt-4 font-sansation">
        <button
          className="flex justify-center bg-[#E04747] px-6 py-2 rounded-lg text-white font-semibold"
          onClick={ () => { setSubmitTestModal(true) } }
        >
          End Meet
        </button>
      </div>
      { submitTestModal ? <ModuleConfirmationModal onPress={ (v) => { onSubmitTest(v) } } /> : null }
    </div>
  );
};

export default VideoTest;
