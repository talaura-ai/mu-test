import VoiceIcon from "../../assets/Group 171.png";
import MicIcon from "../../assets/svg/micIcon2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
import { useNetworkState } from 'react-use';
import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
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
  setLoadingDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";
import CustomToaster from "../../components/Modals/CustomToaster";
import ExitFullScreenModal from "../../components/Modals/exitFullScreen";
import screenfull from "screenfull";
import InternetModal from "../../components/Modals/internetModal";
import moment from "moment";
import { ReactInternetSpeedMeter } from "react-internet-meter";

const width = 650;
const height = 650;
let partNumber = 1;
let multipartMap: any = { Parts: [] };
const bucketName = "masters-unoin";
const key = `live-video/${Date.now()}.webm`;

AWS.config.update({
  accessKeyId: "AKIAXYKJWKKMP33E5KUS",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const VideoTest = () => {
  const navigate = useNavigate();
  const { assessmentId, testId, userId } = useParams();
  const chatEndRef: any = useRef(null);
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const dispatcher = useAppDispatch();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [liveVideoMediaRecorder, setLiveVideoMediaRecorder] = useState<
    MediaRecorder | any
  >(null);
  // const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [submitTestModal, setSubmitTestModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [cameraStats, setCameraStats] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [userMute, setUserMute] = useState(true);
  const [isExitFullScreen, setIsExitFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState({
    title: "",
    answer: "",
  });
  const [conversationAns, setConversationAns] = useState<string>("");
  const [moduleQuestions, setModuleQuestions] = useState<any>([]);
  const [aiChats, setAIChat] = useState<any>([]);
  const [isToasterDisplayed, setIsToasterDisplayed] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [networkChecking, setNetworkChecking] = useState(false);
  const [assessmentModule, setAssessmentModule] = useState<any>({})
  const [isInternet5Mb, setIsInternet5Mb] = useState(true)

  const state = useNetworkState();
  let internetTimer: any = null

  useUserActivityDetection();
  // const audioElement = new Audio();
  let audioElement = useRef(new Audio());
  let speakTimeout: any = null;
  let toasterTimeout: any = null;
  let streamRef: any = useRef(null);
  const uploadIdRef: any = useRef("");

  const { webcamRef, isLoading, detected, facesDetected }: any =
    useFaceDetection({
      faceDetectionOptions: {
        model: "short",
      },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      }),
      camera: ({ mediaSrc, onFrame }: CameraOptions) =>
        new Camera(mediaSrc, {
          onFrame,
          width,
          height,
        }),
    });
  useEffect(() => {
    if (!detected && !isToasterDisplayed && cameraStats && cameraReady) {
      setToastMsg("Face not detected");
      displayToasterFun();
      updateUserActivity();
    }
    if (
      facesDetected > 1 &&
      !isToasterDisplayed &&
      cameraStats &&
      cameraReady
    ) {
      setToastMsg("Multiple face detected");
      displayToasterFun();
      updateUserActivity();
    }
  }, [detected, facesDetected, cameraStats, cameraReady]);
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
      checkScreenExit()
    }
  }, [screenfull.isFullscreen]);

  const checkScreenExit = () => {
    const time = sessionStorage.getItem("screen-exit-time")
    if (time) {
      const seconds = moment().diff(moment(time), 'seconds')
      if (seconds > 30) {
        setIsExitFullScreen(true);
      }
    }
  }

  const handleFullscreenChange = () => {
    if (!screenfull.isFullscreen) {
      setIsExitFullScreen(true);
    }
  };

  useEffect(() => {
    if (state) {
      checkInternet(state?.online)
    }
  }, [state]);

  useEffect(() => {
    checkInternet(isInternet5Mb)
  }, [isInternet5Mb]);

  const checkInternet = (isInternet: any) => {
    clearTimeout(internetTimer)
    if (isInternet) {
      setNetworkChecking(false)
    } else {
      setNetworkChecking(true)
      internetTimer = setTimeout(() => {
        window.location.href = `/assessment/${userId}/${assessmentId}/modules`;
      }, 200000);
    }
  }

  const fullScreenElev: any = document.getElementById("fullscreenDiv");
  const onExitAction = (type: any) => {
    if (type === "cancel") {
      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        screenfull.request(fullScreenElev);
      }
    }
    if (type === "exit") {
      // submitTest();
      stopRecording();
    }
    setIsExitFullScreen(false);
  };

  const displayToasterFun = () => {
    clearTimeout(toasterTimeout);
    toasterTimeout = setTimeout(() => {
      setIsToasterDisplayed(false);
    }, 1000);
    setIsToasterDisplayed(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiChats]);

  useEffect(() => {
    const res = sessionStorage.getItem(`${testId}-${userId}`)
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
        window.location.href = `/assessment/${userId}/${assessmentId}/modules`;
      }, 0);
    }
  }, [])

  // useEffect(() => {
  //   if (assessmentModule?.module?.question) {
  //     const questions = assessmentModule?.module?.question?.map((v: any) => {
  //       return { ...v, answer: v?.answer ? v?.answer : "" };
  //     });
  //     setModuleQuestions(questions);
  //   }
  // }, [assessmentModule]);

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

  const updateUserActivity = () => {
    dispatcher(
      getUserActivityDispatcher({
        candidateId: userId,
      })
    );
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        setMediaRecorder(
          new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" })
        );
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone. Please check your permissions.");
      });
  }, []); // Setup mediaRecorder initially

  // Live video recording
  useEffect(() => {
    const initMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8",
      });
      setLiveVideoMediaRecorder(recorder);
    };
    initMedia();
  }, []);

  useEffect(() => {
    if (mediaRecorder && userId && moduleQuestions && myAssessments) {
      const newSocket = io("wss://talorexvoice.com", {
        query: {
          userId: userId,
        },
      });
      // console.log("socket id", newSocket.id);
      newSocket.on("connect", () => {
        setIsSocketConnected(true);
        setTimeout(() => {
          setCameraReady(true);
        }, 4000);
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
            // console.log("START AI");
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
      newSocket.on("pauseAudio", (data) => {
        if (data?.stop) {
          setIsSpeaking(false);
          audioElement?.current?.pause();
          audioElement.current.currentTime = 0;
          audioElement.current.src = "";
        }
      });
      newSocket.on("question", (data) => {
        // console.log("conversationAns question=>", data);
        setQuestion({ ...question, ...data });
        setAIChat((prev: any) => {
          return [...prev, { type: "ai", text: data?.title }];
        });
        setConversationAns((prev) => {
          return prev + `AI:${data?.title} `;
        });
      });
      newSocket.on("answer", (data) => {
        // console.log("conversationAns answer=>", data);
        audioElement.current.pause();
        audioElement.current.currentTime = 0;
        setAIChat((prev: any) => {
          return [...prev, { type: "user", text: data?.answer }];
        });
        setConversationAns((prev) => {
          return prev + `User:${data?.answer} `;
        });
      });

      newSocket.on("audioData", async (data) => {
        const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob);
        // console.log("audioUrl=>", audioUrl);
        clearTimeout(speakTimeout);
        setIsSpeaking(true);
        audioElement.current.pause();
        audioElement.current.currentTime = 0;
        audioElement.current.src = "";
        speakTimeout = setTimeout(() => {
          audioElement.current.src = audioUrl;
          audioElement.current.play();
        }, 200);
        audioElement.current.onended = () => {
          setIsSpeaking(false);
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
        audioElement.current?.pause();
        audioElement.current.currentTime = 0;
        mediaRecorder.removeEventListener("dataavailable", () => { });
        newSocket?.disconnect();
        if (streamRef?.current) {
          streamRef.current
            ?.getTracks()
            ?.forEach((track: any) => track?.stop());
          streamRef.current = null;
        }
      };
    }
  }, [mediaRecorder, userId, moduleQuestions, myAssessments]);

  useEffect(() => {
    const mediaListner = async () => {
      liveVideoMediaRecorder.ondataavailable = async (event: any) => {
        if (event.data?.size > 0) {
          await uploadChunk(event.data);
        }
      };
      liveVideoMediaRecorder?.start(25000); // Collect data every second
      setIsRecording(true);
      try {
        // Initiate multipart upload
        const createMultipartUpload = await s3
          .createMultipartUpload({
            Bucket: bucketName,
            Key: key,
            ContentType: "video/webm",
          })
          .promise();
        uploadIdRef.current = createMultipartUpload.UploadId;
        // console.log("Multipart upload initiated:", createMultipartUpload);
      } catch (err) {
        console.error("Error initiating multipart upload:", err);
      }
    };
    if (liveVideoMediaRecorder) {
      mediaListner();
    }
  }, [liveVideoMediaRecorder]);

  async function uploadChunk (blob: any) {
    const params = {
      Body: blob,
      Bucket: bucketName,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadIdRef.current,
    };
    // console.log("params=>", params, uploadIdRef.current);
    try {
      const uploadPart = await s3.uploadPart(params).promise();
      // console.log("UploadPart response:", uploadPart);
      if (uploadPart && uploadPart.ETag) {
        multipartMap.Parts.push({
          ETag: uploadPart.ETag,
          PartNumber: partNumber,
        });
        partNumber++;
        console.log("Uploaded part:", partNumber - 1);
      } else {
        console.error("ETag is undefined in uploadPart response:", uploadPart);
      }
    } catch (err) {
      console.error("Error uploading part:", err);
    }
  }

  async function stopRecording () {
    dispatcher(setLoadingDispatcher(true));
    liveVideoMediaRecorder?.stop();
    clearTimeout(speakTimeout);
    audioElement?.current?.pause();
    audioElement.current.currentTime = 0;
    audioElement.current.src = "";
    webcamRef.current?.video?.srcObject
      ?.getTracks()
      ?.forEach((track: any) => track?.stop());
    webcamRef.current.video.srcObject = null;
    setIsSpeaking(false);
    if (streamRef?.current) {
      streamRef.current?.getTracks()?.forEach((track: any) => {
        track?.stop();
        streamRef.current?.removeTrack(track);
      });
      streamRef.current = null;
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    try {
      // Complete multipart upload
      const completeMultipartUpload = await s3
        .completeMultipartUpload({
          Bucket: bucketName,
          Key: key,
          UploadId: uploadIdRef.current,
          MultipartUpload: multipartMap,
        })
        .promise();
      submitTest(completeMultipartUpload?.Location || "");
      // console.log("Multipart upload completed:", completeMultipartUpload);
    } catch (err) {
      console.error("Error completing multipart upload:", err);
      submitTest("");
    }
  }

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
      stopRecording();
    }
  };
  const videoConstraints = {
    facingMode: "user",
  };

  const onSubmitTest = (type: string) => {
    setSubmitTestModal(false);
    if (type === "submit") {
      // submitTest();
      stopRecording();
    }
  };

  const submitTest = async (location: string) => {
    try {
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          videoUrl: location,
          question: [{ ...moduleQuestions?.[0], answer: conversationAns }],
        })
      );
      if (res?.payload.data?.status) {
        toast.success(
          `${assessmentModule?.module?.name} completed successfully!`,
          {}
        );
        // navigate(-1);
        // screenfull.exit()
        window.location.href = `/assessment/${userId}/${assessmentId}/modules`;
      } else {
        toast.error("Oops! Submission is failed", {});
        dispatcher(setLoadingDispatcher(false));
      }
    } catch (error) {
      toast.error("Oops! Internal server error", {});
      // console.log("error=>", error);
      dispatcher(setLoadingDispatcher(false));
    }
  };
  return (
    <>
      <ReactInternetSpeedMeter
        outputType=""
        pingInterval={ 5000 } // milliseconds
        thresholdUnit="megabyte" // "byte" , "kilobyte", "megabyte"
        threshold={ 5 }
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
        downloadSize="500000" //bytes
        callbackFunctionOnNetworkDown={ (data: any) => {
          if (isInternet5Mb) {
            setIsInternet5Mb(false)
          }
        } }
        callbackFunctionOnNetworkTest={ (data: any) => {
          if (data >= 5 && !isInternet5Mb) {
            setIsInternet5Mb(true)
          }
        } }
      />
      <div className="sm:p-6 md:px-20 md:py-12 p-4">
        { isToasterDisplayed && (
          <CustomToaster
            message={ toastMsg }
            onClose={ () => {
              setIsToasterDisplayed(false);
            } }
          />
        ) }
        <TimerCounterWithProgress
          timestamp={ assessmentModule?.module?.time || 0 }
          title={ "Video Round" }
          onTimeout={ onTimeout }
          showTimer={ false }
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
                  className={ `h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center ${isSpeaking ? "animation-pulse" : ""
                    }` }
                >
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
              <div className="flex rounded-xl w-full overflow-hidden h-[470px] bg-gray-200">
                { isSocketConnected && (
                  <Webcam
                    ref={ webcamRef }
                    screenshotFormat="image/jpeg"
                    screenshotQuality={ 1 }
                    // audio={userMute}
                    videoConstraints={ videoConstraints }
                    onUserMedia={ () => {
                      setCameraStats(true);
                    } }
                    onUserMediaError={ () => {
                      setCameraStats(false);
                    } }
                    className="overflow-hidden rounded-xl bg-gray-200 object-cover w-full"
                  />
                ) }
                <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation capitalize">
                  { (myAssessments && myAssessments?.[0]?.name) || "Candidate" }
                </div>
                <div className="absolute right-6 bottom-4 text-white  px-4 py-1  ">
                  <img
                    onClick={ () => {
                      setUserMute(!userMute);
                    } }
                    src={ MicIcon }
                    className="h-8 w-10"
                    alt="mic"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[20%] bg-white shadow rounded-lg p-4 ml-4">
            <div className="flex w-full flex-col h-[440px]">
              <div className="flex gap-2 px-2 pb-2">
                <img src={ VoiceIcon } alt="icn" />
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
      </div>
    </>
  );
};

export default VideoTest;
