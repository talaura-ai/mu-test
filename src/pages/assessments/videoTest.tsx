import VoiceIcon from "../../assets/Group 171.png";
import MicIcon from "../../assets/svg/videoMicIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
import Lottie from "react-lottie";
import { useNetworkState } from "react-use";
import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { toast } from "react-toastify";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import { v4 as uuidv4 } from "uuid";
import ModuleConfirmationModal from "../../components/Modals/confirmationModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import {
  getModuleSubmissionDispatcher,
  getUserActivityDispatcher,
  setLoadingDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import useUserActivityDetection from "../../hooks/miscellaneousActivityDetection";
import CustomToaster from "../../components/Modals/CustomToaster";
import ExitFullScreenModal from "../../components/Modals/exitFullScreen";
import screenfull from "screenfull";
import InternetModal from "../../components/Modals/internetModal";
import moment from "moment";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import InternetSpeedModal from "../../components/Modals/internetSpeedModal";
import TabChangeDetectionModal from "../../components/Modals/tabChangeDetected";
import { ReactSVG } from "react-svg";
import QuickStartModal from "../../components/Modals/quickStartModal";
import { detectBrowser } from "../../utils";
import CustomSpeedChecker from "../../components/Modals/CustomSpeedChecker";
import aiSpeaking from "../../assets/lottie/aiSpeaking.json";
import aiListening from "../../assets/lottie/aiListening.json";
import { createDB } from "../../utils/helper";

const width = 650;
const height = 650;
let partNumber = 1;
let chunkNumber = 0;
let multipartMap: any = { Parts: [] };
const bucketName = "masters-unoin";
const key = `live-video/${Date.now()}.webm`;
const audioKey = `live-audio/${Date.now()}.webm`;
let globalSilentTime = moment();

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
  const socketRef: any = useRef(null);
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
  const [isSpeaking, setIsSpeaking] = useState<number>(0);
  // Thinking = 0 Lisneting = 1 Speaking = 2
  const [isRecording, setIsRecording] = useState(true);
  const [cameraStats, setCameraStats] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isExitFullScreen, setIsExitFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationAns, setConversationAns] = useState<string>("");
  const [moduleQuestions, setModuleQuestions] = useState<any>([]);
  const [aiChats, setAIChat] = useState<any>([]);
  const [isToasterDisplayed, setIsToasterDisplayed] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [networkChecking, setNetworkChecking] = useState(false);
  const [assessmentModule, setAssessmentModule] = useState<any>({});
  const [isInternet5Mb, setIsInternet5Mb] = useState(true);
  const [moduleTime, setModuleTime] = useState(0);
  const [tabSwitchDetected, setTabSwitchDetected] = useState(false);
  const [quickStartInSafari, setQuickStartInSafari] = useState(false);
  const [submitLoaderMessage, setSubmitLoaderMessage] = useState(false);
  const state = useNetworkState();
  let internetTimer: any = null;
  let speedTimer: any = null;

  useUserActivityDetection();
  // const audioElement = new Audio();
  let audioElement = useRef(new Audio());
  let speakTimeout: any = null;
  let toasterTimeout: any = null;
  let streamRef: any = useRef(null);
  let AISpeakingRef: any = useRef(null);
  let AIChatDataRef: any = useRef(null);
  const uploadIdRef: any = useRef("");

  let audioStatus: any = useRef(0);
  let audioList: any = useRef([]);
  let audioIndex: any = useRef(0);

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
      updateUserActivity("faceNotDetected");
    }
    if (
      facesDetected > 1 &&
      !isToasterDisplayed &&
      cameraStats &&
      cameraReady
    ) {
      setToastMsg("Multiple face detected");
      displayToasterFun();
      updateUserActivity("MultipleFaceDetected");
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
      checkScreenExit();
    }
  }, [screenfull, screenfull.isFullscreen, screenfull.isEnabled]);

  const checkScreenExit = () => {
    const time = sessionStorage.getItem("screen-exit-time");
    if (time) {
      const seconds = moment().diff(moment(time), "seconds");
      if (seconds > 2) {
        setIsExitFullScreen(true);
        updateUserActivity("exitFullScreen");
      }
    }
  };

  const handleFullscreenChange = () => {
    if (!screenfull.isFullscreen) {
      setIsExitFullScreen(true);
      updateUserActivity("exitFullScreen");
    }
  };

  useEffect(() => {
    if (state) {
      checkInternet(state?.online);
    }
  }, [state]);

  const clearStoredSession = () => {
    sessionStorage.setItem(`${testId}-${userId}`, "");
    sessionStorage.setItem(`txp-${testId}-${userId}`, "0");
    sessionStorage.setItem("screen-exit-time", "");
  };

  const checkInternet = (isInternet: any) => {
    clearTimeout(internetTimer);
    if (isInternet) {
      setNetworkChecking(false);
    } else {
      setNetworkChecking(true);
      setIsInternet5Mb(true);
      clearTimeout(speedTimer);
      internetTimer = setTimeout(() => {
        goBack();
      }, 200000);
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
      // submitTest();
      stopRecording();
    }
    setIsExitFullScreen(false);
  };

  const displayToasterFun = () => {
    clearTimeout(toasterTimeout);
    toasterTimeout = setTimeout(() => {
      setIsToasterDisplayed(false);
    }, 5000);
    setIsToasterDisplayed(true);
  };

  useEffect(() => {
    scrollToBottom();
    AIChatDataRef.current = aiChats;
  }, [aiChats]);

  useEffect(() => {
    audioStatus.current = 0;
    audioList.current = [];
    audioIndex.current = 0;
    const res = sessionStorage.getItem(`${testId}-${userId}`);
    const time = sessionStorage.getItem(`txp-${testId}-${userId}`);
    if (res) {
      const assessmentTestData: any = JSON.parse(
        decodeURIComponent(escape(atob(res)))
      );
      console.log("assessmentTestData=>", assessmentTestData);
      setAssessmentModule(assessmentTestData);
      if (assessmentTestData?.module?.question) {
        const questions = assessmentTestData?.module?.question?.map(
          (v: any) => {
            return { ...v, answer: v?.answer ? v?.answer : "" };
          }
        );
        setModuleQuestions(questions);
      }
    } else {
      setTimeout(() => {
        goBack();
      }, 0);
    }
    if (time) {
      setModuleTime(Number(time));
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleVisibilityChange() {
    if (document?.hidden) {
      updateUserActivity("tabChangeDetected");
      setTabSwitchDetected(true);
    }
  }
  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const updateUserActivity = (type: string) => {
    dispatcher(
      getUserActivityDispatcher({
        candidateId: userId,
        type: type,
      })
    );
  };

  useEffect(() => {
    setQuickStartInSafari(detectBrowser() === "Safari");
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream, {
          mimeType:
            detectBrowser() === "Safari"
              ? "audio/mp4"
              : "audio/webm; codecs=opus",
        });
        setMediaRecorder(recorder);
      } catch (error) {
        console.log("ERR", error);
      }
    };
    initMedia();
  }, []);

  // Live video recording
  useEffect(() => {
    const initMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const recorder = new MediaRecorder(stream, {
        mimeType:
          detectBrowser() === "Safari" ? "video/mp4" : "video/webm; codecs=vp8",
      });
      setLiveVideoMediaRecorder(recorder);
    };
    initMedia();
  }, []);

  useEffect(() => {
    if (
      mediaRecorder &&
      userId &&
      moduleQuestions &&
      myAssessments &&
      !quickStartInSafari
    ) {
      const newSocket = io("wss://talorexvoice.com/socket.io", {
        query: {
          userId: userId,
        },
        transports: ["websocket"],
      });

      socketRef.current = newSocket;

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:=>", error);
      });
      newSocket.on("disconnect", (reason, details) => {
        console.error("disconnect error:=>", reason, details);
      });
      // console.log("socket id", newSocket.id);
      newSocket.on("connect", () => {
        globalSilentTime = moment();
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
        mediaRecorder.start(200);
        mediaRecorder.ondataavailable = async (event) => {
          if (event?.data?.size > 0) {
            try {
              const arrayBuffer = await event.data.arrayBuffer();
              const base64String = arrayBufferToBase64(arrayBuffer);
              console.log("START AI");
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
        if (data?.stop && AISpeakingRef?.current) {
          setIsSpeaking(1);
          console.log("pauseAudio=>****************************");
          globalSilentTime = moment();
          if (AISpeakingRef?.current) {
            let flag = true;
            let updatedArray: any = [];
            for (
              let index = AIChatDataRef?.current?.length - 1;
              index >= 0;
              index--
            ) {
              if (AIChatDataRef?.current?.[index]?.type === "AI" && flag) {
              } else {
                flag = false;
                updatedArray = [
                  AIChatDataRef?.current?.[index],
                  ...updatedArray,
                ];
              }
            }
            setAIChat((prev: any) => {
              return [...updatedArray];
            });
          }
          AISpeakingRef.current = false;
          audioElement?.current?.pause();
          audioElement.current.currentTime = 0;
          audioElement.current.src = "";
          audioStatus.current = 0;
          audioList.current = [];
          audioIndex.current = 0;
        }
      });
      newSocket.on("question", (data) => {
        if (data?.title?.trim()) {
          setAIChat((prev: any) => {
            return [...prev, { type: "AI", text: data?.title }];
          });
        }
        // setConversationAns((prev) => {
        //   return prev + `AI:${data?.title} `;
        // });
      });
      newSocket.on("answer", (data) => {
        console.log(
          "ANS---------------------",
          data?.answer,
          AISpeakingRef?.current
        );
        if (AISpeakingRef?.current) {
          let flag = true;
          let updatedArray: any = [];
          for (
            let index = AIChatDataRef?.current?.length - 1;
            index >= 0;
            index--
          ) {
            if (AIChatDataRef?.current?.[index]?.type === "AI" && flag) {
            } else {
              flag = false;
              updatedArray = [AIChatDataRef?.current?.[index], ...updatedArray];
            }
          }
          setAIChat((prev: any) => {
            return [...updatedArray, { type: "User", text: data?.answer }];
          });
        } else {
          setAIChat((prev: any) => {
            return [...prev, { type: "User", text: data?.answer }];
          });
        }
        AISpeakingRef.current = false;
        audioElement?.current?.pause();
        audioElement.current.currentTime = 0;
        audioStatus.current = 0;
        audioList.current = [];
        audioIndex.current = 0;
        setIsSpeaking(0);
        // setConversationAns((prev) => {
        //   return prev + `User:${data?.answer} `;
        // });
      });

      newSocket.on("audioData", async (data) => {
        const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
        const audioUrl: any = URL.createObjectURL(audioBlob);
        clearTimeout(speakTimeout);
        speakTimeout = setTimeout(() => {
          if (audioList?.current?.length) {
            audioList.current = [...audioList.current, audioUrl];
          } else {
            audioList.current = [audioUrl];
            const differenceInMilliseconds = moment().diff(
              globalSilentTime,
              "milliseconds"
            );
            console.log(
              "*****differenceInMilliseconds******",
              differenceInMilliseconds
            );
            globalSilentTime = moment();
            storeSilentAudio(differenceInMilliseconds);
          }
          setIsSpeaking(2);
          AISpeakingRef.current = true;
          console.log(
            "CCC----",
            audioStatus.current,
            audioIndex.current,
            audioList.current
          );
          if (audioStatus?.current === 0 && audioList?.current?.length) {
            audioStatus.current = 1;
            playAudioFile();
          }
        }, 0);

        // speakTimeout = setTimeout(() => {
        //   audioElement.current.src = audioUrl;
        //   audioElement.current.play();
        // }, 200);
        audioElement.current.onended = () => {
          console.log(
            "ENMDEEDDD----",
            audioIndex.current,
            audioList?.current?.length
          );
          if (audioList?.current?.length - 1 === audioIndex?.current) {
            audioStatus.current = 0;
            audioList.current = [];
            audioIndex.current = 0;
            audioElement?.current?.pause();
            audioElement.current.currentTime = 0;
            audioElement.current.src = "";
            setIsSpeaking(1);
            AISpeakingRef.current = false;
            globalSilentTime = moment();
          } else {
            audioIndex.current = audioIndex?.current + 1;
            audioStatus.current = 0;
            if (audioStatus?.current === 0 && audioList?.current?.length) {
              AISpeakingRef.current = true;
              audioStatus.current = 1;
              playAudioFile();
            }
          }
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
        mediaRecorder.removeEventListener("dataavailable", () => {});
        newSocket?.disconnect();
        if (streamRef?.current) {
          streamRef.current
            ?.getTracks()
            ?.forEach((track: any) => track?.stop());
          streamRef.current = null;
        }
      };
    }
  }, [
    mediaRecorder,
    userId,
    moduleQuestions,
    myAssessments,
    quickStartInSafari,
  ]);

  const playAudioFile = () => {
    try {
      if (
        audioList?.current?.length - 1 >= audioIndex?.current &&
        audioElement?.current &&
        AISpeakingRef?.current
      ) {
        audioElement.current.src = audioList.current[audioIndex.current];
        audioElement?.current
          ?.play()
          ?.then(async () => {
            console.log("Audio is playing");
            const audioBlob = await fetch(
              audioList.current[audioIndex.current]
            ).then((res) => res.blob());
            console.log("audioBlob=> IDB", audioBlob);
            saveChunkToIndexedDB(audioBlob, 0, "AI");
          })
          .catch((error) => {
            console.log("Play request was interrupted", error);
          });
      }
    } catch (error) {
      console.log("error=>", error);
    }
  };

  const storeSilentAudio = async (milli: number) => {
    const silentBlob = createSilentAudio(milli); // 1 second of silence
    await saveChunkToIndexedDB(silentBlob, 0, "silent");
  };

  // Store audio chunk in IndexedDB
  const saveChunkToIndexedDB = async (
    blob: Blob,
    partNumber111: number,
    type: string
  ) => {
    try {
      chunkNumber++;
      const db = await createDB();
      if (db) {
        await db.put("chunks", { id: chunkNumber, chunk: blob, type });
        console.log(`Chunk ${chunkNumber} saved to IndexedDB`);
      }
    } catch (error) {
      console.log("Error in saveChunkToIndexedDB", error);
    }
  };

  const combineDiscontinuousAudioChunks = useCallback(async () => {
    try {
      const db = await createDB();
      if (db) {
        const transaction = db.transaction("chunks", "readonly");
        const store = transaction.objectStore("chunks");
        const allKeys = await store.getAllKeys();
        const audioChunks = [];

        for (let key of allKeys) {
          const record = (await store.get(key)) as {
            id: number;
            chunk: Blob;
            type: string;
          };
          audioChunks.push(record.chunk); // Push only the Blob (audio chunk)
        }

        if (audioChunks.length > 0) {
          // Create an AudioContext to decode and process audio chunks
          const audioContext = new AudioContext();

          // Decode all audio chunks asynchronously
          const decodedChunks = await Promise.all(
            audioChunks.map(async (chunk) => {
              const arrayBuffer = await chunk.arrayBuffer();
              return audioContext.decodeAudioData(arrayBuffer);
            })
          );

          // Calculate the total length of the combined buffer
          const totalLength = decodedChunks.reduce(
            (sum, buffer) => sum + buffer.length,
            0
          );

          // Create a new buffer to hold the combined audio
          const combinedBuffer = audioContext.createBuffer(
            decodedChunks[0].numberOfChannels,
            totalLength,
            decodedChunks[0].sampleRate
          );

          // Copy each chunk's buffer data into the combined buffer
          let offset = 0;
          for (let buffer of decodedChunks) {
            for (
              let channel = 0;
              channel < buffer.numberOfChannels;
              channel++
            ) {
              combinedBuffer.copyToChannel(
                buffer.getChannelData(channel),
                channel,
                offset
              );
            }
            offset += buffer.length;
          }

          // Export the combined buffer as a Blob (WAV or another format)
          const combinedBlob = await exportBufferToWAV(combinedBuffer);

          // Create a URL for the combined audio blob
          const combinedAudioUrl = URL.createObjectURL(combinedBlob);
          console.log("Combined audio URL: ", combinedAudioUrl);

          // Create an audio element to play the combined audio
          // const audioElement = document.createElement("audio");
          // audioElement.src = combinedAudioUrl;
          // audioElement.controls = true;
          // document.body.appendChild(audioElement);

          // Alternatively, download the combined audio file
          // const downloadLink = document.createElement("a");
          // downloadLink.href = combinedAudioUrl;
          // downloadLink.download = "combined_audio.wav"; // Name the file as needed
          // downloadLink.click();

          const params = {
            Bucket: bucketName,
            Key: audioKey,
            Body: combinedBlob,
            ContentType: "audio/wav",
          };
          try {
            const res = await s3.upload(params).promise();
            console.log("res----", res);
            return res?.Location;
          } catch (error) {
            console.log("ERROR---", error);
            return "";
          }
        } else {
          console.log("No audio chunks found in IndexedDB.");
          return "";
        }
      }
    } catch (err) {
      console.error(err);
      return "";
    }
  }, []);

  // Helper function to export the AudioBuffer to WAV format
  async function exportBufferToWAV(audioBuffer: AudioBuffer) {
    // Create a new offline audio context for rendering the audio buffer
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Create a buffer source for the audio buffer
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    // Render the audio data
    const renderedBuffer = await offlineContext.startRendering();

    // Convert the rendered audio buffer to WAV Blob
    const wavBlob = audioBufferToWavBlob(renderedBuffer);
    return wavBlob;
  }

  // Utility function to convert an AudioBuffer to a WAV Blob
  function audioBufferToWavBlob(buffer: AudioBuffer) {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2 + 44; // 16-bit PCM
    const bufferData = new ArrayBuffer(length);
    const view = new DataView(bufferData);

    // Write WAV container header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + buffer.length * numOfChannels * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, buffer.length * numOfChannels * 2, true);

    // Write interleaved PCM samples
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i] * 0x7fff;
        view.setInt16(offset, sample < 0 ? sample : sample, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: "audio/wav" });
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function createSilentAudio(durationMs: number) {
    const sampleRate = 44100;
    const numChannels = 1;
    const bitsPerSample = 16;
    const numSamples = Math.floor((sampleRate * durationMs) / 1000);
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;
    const dataLength = numSamples * blockAlign;

    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* file length */
    view.setUint32(4, 36 + dataLength, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (PCM) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate */
    view.setUint32(28, byteRate, true);
    /* block align */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitsPerSample, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, dataLength, true);

    // Write PCM samples (silence)
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, 0, true); // Little endian
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

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

  async function uploadChunk(blob: any) {
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

  async function stopRecording() {
    dispatcher(setLoadingDispatcher(true));
    liveVideoMediaRecorder?.stop();
    clearTimeout(speakTimeout);
    audioElement?.current?.pause();
    audioElement.current.currentTime = 0;
    audioElement.current.src = "";
    audioStatus.current = 0;
    audioList.current = [];
    audioIndex.current = 0;
    webcamRef?.current?.video?.srcObject
      ?.getTracks()
      ?.forEach((track: any) => track?.stop());
    if (webcamRef && webcamRef?.current) {
      webcamRef.current.video.srcObject = null;
    }
    setIsSpeaking(1);
    AISpeakingRef.current = false;
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
    let audioURL: any = "";
    try {
      audioURL = await combineDiscontinuousAudioChunks();
    } catch (error) {
      console.log("error a", error);
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
      submitTest(completeMultipartUpload?.Location || "", audioURL);
      console.log(
        "Multipart upload completeMultipartUpload:",
        completeMultipartUpload
      );
    } catch (err) {
      console.error("Error completing multipart upload:", err);
      submitTest("", audioURL);
    }
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
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

  // useEffect(() => {
  //   if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //     if (isRecording) {
  //       mediaRecorder.resume();
  //     } else {
  //       mediaRecorder.pause();
  //     }
  //   }
  // }, [isRecording, mediaRecorder]);

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
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopRecording();
      setSubmitLoaderMessage(true);
    }
  };

  const getConversation = () => {
    let ans = "";
    aiChats?.map((v: any) => {
      if (v?.type === "AI") {
        ans = ans + `AI:${v?.text} `;
      } else {
        ans = ans + `User:${v?.text} `;
      }
    });
    return ans;
  };
  const submitTest = async (location: string, audioUrl: string) => {
    try {
      const res = await dispatcher(
        getModuleSubmissionDispatcher({
          moduleId: testId,
          videoUrl: location,
          audioUrl,
          question: [{ ...moduleQuestions?.[0], answer: getConversation() }],
        })
      );
      if (res?.payload.data?.status) {
        clearIndexedDB();
        toast.success(
          `${assessmentModule?.module?.name} completed successfully!`,
          {}
        );
        // navigate(-1);
        // screenfull.exit()
        goBack();
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

  const clearIndexedDB = async () => {
    const db = await createDB();
    if (db) {
      const transaction = db.transaction("chunks", "readwrite");
      const store = transaction.objectStore("chunks");
      await store.clear();
      console.log("IndexedDB cleared.");
    }
  };

  const onClose = () => {
    setIsInternet5Mb(true);
  };

  const goBack = () => {
    clearStoredSession();
    window.location.replace(
      `/candidate/assessment/${userId}/${assessmentId}/modules`
    );
  };

  const speedCheckerFun = () => {
    setIsInternet5Mb(false);
    speedTimer = setTimeout(() => {
      setIsInternet5Mb(true);
    }, 30000);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: aiSpeaking,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptionsLi = {
    loop: true,
    autoplay: true,
    animationData: aiListening,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <ReactInternetSpeedMeter
        outputType=""
        pingInterval={5000} // milliseconds
        thresholdUnit="megabyte" // "byte" , "kilobyte", "megabyte"
        threshold={4}
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
        downloadSize="500000" //bytes
        callbackFunctionOnNetworkDown={(data: any) => {
          if (isInternet5Mb) {
            speedCheckerFun();
          }
        }}
        callbackFunctionOnNetworkTest={(data: any) => {
          if (data >= 4 && !isInternet5Mb) {
            setIsInternet5Mb(true);
            clearTimeout(speedTimer);
          }
        }}
      />
      <div className="sm:p-6 md:px-20 md:py-12 p-4">
        {isToasterDisplayed && toastMsg && (
          <CustomToaster
            message={toastMsg}
            onClose={() => {
              setIsToasterDisplayed(false);
            }}
          />
        )}
        {!isInternet5Mb && <CustomSpeedChecker />}
        <TimerCounterWithProgress
          timestamp={moduleTime || 0}
          title={"Video Round"}
          onTimeout={onTimeout}
          showTimer={true}
          showProgressFromLT={true}
        />
        <div className="flex">
          <span className="sm:text-[20px] text-[14px] text-black font-sansation font-semibold text-center">
            TALBot is your interviewer, please listen carefully and respond to
            the questions asked by TALBot
          </span>
        </div>
        {/* <div className="flex mb-3">
        <span className="text-[32px] font-semibold font-sansation text-[#CC8448]">
          Case Study
        </span>
      </div> */}
        <div className="flex md:flex-row flex-col md:justify-center sm:mt-8 mt-2">
          <div className="flex flex-col sm:w-[65%] w-[100%] h-1/2 md:flex-row justify-between">
            {/* <div className="relative flex w-[50%] h-[470px] bg-[#474646] justify-center items-center rounded-xl border border-[#E5A971] mr-4">
              <div className="flex justify-center items-center">
                <div
                  className={`h-10 w-10 md:h-40 md:w-40 bg-white text-[#E5A971] rounded-full text-[20px] md:text-[60px] font-semibold font-sansation flex justify-center items-center ${
                    isSpeaking ? "animation-pulse" : ""
                  }`}
                >
                  Ai
                </div>
              </div>
              <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
                Ai Bot
              </div>
              <div className="absolute right-2 bottom-4 text-white  px-4 py-1  ">
                <ReactSVG src={MicIcon} className="h-8 w-10" />
              </div>
            </div> */}
            <div className="flex relative h-1/2 w-full rounded-xl overflow-hidden">
              <div className="flex rounded-xl w-full overflow-hidden h-[500px] bg-gray-200">
                {isSocketConnected && (
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1}
                    // audio={userMute}
                    videoConstraints={videoConstraints}
                    onUserMedia={() => {
                      setCameraStats(true);
                    }}
                    onUserMediaError={() => {
                      setCameraStats(false);
                    }}
                    className="overflow-hidden rounded-xl bg-gray-200 object-cover w-full"
                  />
                )}
                <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation capitalize">
                  {(myAssessments && myAssessments?.[0]?.name) || "Candidate"}
                </div>
                {/* <div className="absolute right-6 bottom-4 text-white  px-4 py-1  ">
                  <ReactSVG
                    onClick={() => {
                      setUserMute(!userMute);
                    }}
                    src={MicIcon}
                    className="h-8 w-10"
                  />
                </div> */}
                <div className="absolute bottom-4 right-4 flex sm:w-[200px] sm:h-[200px] w-[151px] h-[100pxx] bg-[#474646] justify-center items-center rounded-xl border-[2px] border-[#CC8448]">
                  <div className="flex justify-center items-center">
                    {/* <div
                      className={`h-10 w-10 md:h-[90px] md:w-[90px] bg-white text-[#E5A971] rounded-full text-[20px] md:text-[36px] font-semibold font-sansation flex justify-center items-center ${
                        isSpeaking ? "animation-pulse" : ""
                      }`}
                    >
                      AI
                    </div> */}
                    {isSpeaking === 2 ? (
                      <Lottie
                        options={defaultOptions}
                        height={120}
                        width={120}
                      />
                    ) : (
                      <Lottie
                        options={defaultOptionsLi}
                        height={170}
                        width={170}
                      />
                    )}
                    {isSpeaking === 2 ? (
                      <div
                        className={`absolute text-[#E5A971] text-[16px] md:text-[24px] font-semibold font-sansation bg-[#474646]`}
                      >
                        AI
                      </div>
                    ) : (
                      <div
                        className={`absolute text-[#E5A971] text-[8px] md:text-[12px] font-semibold font-sansation bg-[#474646]`}
                      >
                        {isSpeaking === 0 ? "Thinking" : "Listening"}
                      </div>
                    )}
                  </div>
                  <div className="absolute left-2 bottom-2 bg-black opacity-75 text-white font-semibold px-3 py-1 text-[10px] rounded-[10px] font-sansation">
                    AI Bot
                  </div>
                  <div className="absolute right-2 bottom-2 text-white">
                    <ReactSVG
                      src={MicIcon}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:flex hidden flex-col sm:w-[35%] w-[100%] bg-white shadow rounded-lg p-4 sm:ml-4 ml-0 sm:mt-0 mt-4">
            <div className="flex w-full flex-col h-[440px]">
              <div className="flex gap-2 px-2 pb-2">
                <img src={VoiceIcon} />
                <span className="text-xs text-gray-300 mt-2">CC/Subtitle </span>
              </div>
              <div className="flex flex-col mx-2 bg-white overflow-y-scroll space-y-2">
                {Array.from(
                  new Map(aiChats?.map((itm: any) => [itm?.text, itm])).values()
                )?.map((item: any, index: number) => {
                  if (item?.type === "AI") {
                    return (
                      <div
                        key={item?.text + index}
                        className="flex flex-col gap-1 w-full max-w-[80%]"
                      >
                        <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-[#F5F2F2] rounded-xl">
                          <p className="text-sm font-normal text-gray-900">
                            {item?.text}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item?.text + index}
                        className="flex justify-end"
                      >
                        <div className="bg-[#F5F2F2] text-black p-2 rounded-lg max-w-[80%]">
                          {item?.text}
                        </div>
                      </div>
                    );
                  }
                })}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:justify-end justify-center sm:py-6 mt-4 font-sansation">
          <button
            className="flex justify-center bg-[#40B24B] sm:px-12 px-8 py-2 rounded-lg text-white font-semibold font-sansation"
            onClick={() => {
              setSubmitTestModal(true);
            }}
          >
            Submit
          </button>
        </div>
        {submitTestModal ? (
          <ModuleConfirmationModal
            onPress={(v) => {
              onSubmitTest(v);
            }}
            title={assessmentModule?.module?.name}
          />
        ) : null}
        {isExitFullScreen ? (
          <ExitFullScreenModal
            onPress={(v) => {
              onExitAction(v);
            }}
          />
        ) : null}
        {networkChecking && <InternetModal />}
        {/* { !isInternet5Mb && <InternetSpeedModal onClose={ () => { onClose() } } /> } */}
        {tabSwitchDetected && (
          <TabChangeDetectionModal
            onPress={() => {
              setTabSwitchDetected(false);
            }}
          />
        )}
        {quickStartInSafari && (
          <QuickStartModal
            onClose={() => {
              setQuickStartInSafari(false);
            }}
          />
        )}
        {submitLoaderMessage && (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 z-[60] outline-none focus:outline-none">
              <div className="relative mx-auto sm:w-[550px] w-[90%]">
                <div className="border-2 border-[#cc8448] rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="relative flex-auto justify-center flex-col items-center">
                    <h1 className="text-black leading-relaxed px-8 pt-4 font-sansation font-medium text-[22px] text-center">
                      You interview is being submitted.
                    </h1>
                    <h2 className="text-black leading-relaxed px-8 pb-4 font-sansation font-medium text-[16px] text-center">
                      Please do not close this tab/window.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
          </>
        )}
      </div>
    </>
  );
};

export default VideoTest;
