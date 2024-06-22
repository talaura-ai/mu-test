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
import usePageVisibility from "../../hooks/tabDetection";
import TimerCounterWithProgress from "../../components/timerCounterWithProgress";
import moment from "moment";
const width = 650;
const height = 650;
const VideoTest = () => {
  // const webcamRef = useRef<any>(null);
  const visibility = usePageVisibility()
  let videoRef = useRef<any>();
  let canvasRef = useRef<any>();
  const navigate = useNavigate();
  const { userId } = useParams();
  const chatEndRef: any = useRef(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [cameraStats, setCameraStats] = useState(0);
  const [userMute, setUserMute] = useState(true);
  const [faceProctoringData, setFaceProctoringData] = useState<any>([]);

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
    let dataUpdate = [...faceProctoringData]
    dataUpdate.push(moment().format("HH:mm:ss") + " " + "Face detected: " + detected)
    dataUpdate.push(moment().format("HH:mm:ss") + " " + "No. of faces detected: " + facesDetected)
    if (!detected) {
      const screenshot = webcamRef.current.getScreenshot();
      console.log('screenshot=>', screenshot)
    }
    setFaceProctoringData(dataUpdate)
  }, [detected, facesDetected])

  useEffect(() => {
    scrollToBottom();
  }, [faceProctoringData]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // //Disable Right click
  // if (document.addEventListener) {
  //   document.addEventListener('contextmenu', function (e) {
  //     e.preventDefault();
  //   }, false);
  // }

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      // Here you can handle logic before the unload event
      const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
      event.returnValue = message; // Standard for most browsers
      console.log('Browser Closing')
      return message; // For some older browsers
    };
    const handleUnload = () => {
      // Logic to handle page reload
      console.log('Page is being reloaded');
      console.log('Page reloading')
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  // Alert on Tab Changed within the Same browser Window
  function handleVisibilityChange () {
    if (document.hidden) {
      console.log("Tab Change Detected", "Action has been Recorded", "error");
      toast.error("Alert: Tab Change Detected", {});
      // the page is hidden
    } else {
      console.log("ACTIVE")
      // the page is visible
    }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMediaRecorder(new MediaRecorder(stream));
    });
  }, []); // Setup mediaRecorder initially

  useEffect(() => {
    if (mediaRecorder) {
      const socket = io("ws://34.100.209.222:4000");
      // console.log("websocket");
      socket.on("connect", async () => {
        // console.log("client connected to websocket");
        mediaRecorder.addEventListener("dataavailable", (event) => {
          // console.log('dataavailable', event)
          if (event?.data?.size > 0) {
            console.log('packet-sent')
            socket.emit("packet-sent", event.data);
          }
        });
        mediaRecorder.start(500);
      });
      socket.on("disconnect", () => {
        // console.log("disconnect", socket.id); // undefined
      });
      socket.on("connect_error", (error) => {
        // console.log("connect_error", error);
      });
      socket.on("audioData", (arrayBuffer) => {
        setIsSpeaking(true)
        setIsRecording(false);
        // console.log('audioData')
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        const audioElement = new Audio(audioUrl);
        audioElement.onended = () => {
          setIsRecording(true)
          setIsSpeaking(false)
        }
        audioElement.play();
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [mediaRecorder]);

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
            <div className="flex flex-col mx-2 bg-white overflow-y-scroll">
              { faceProctoringData?.map((item: any, index: number) => (
                <span key={ item + index }>
                  { item }
                </span>
              )) }
              <div ref={ chatEndRef } />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-6 mt-4 font-sansation">
        <button
          className="flex justify-center bg-[#E04747] px-6 py-2 rounded-lg text-white font-semibold"
          onClick={ () => navigate(`/assessment/${userId}/dashboard`) }
        >
          End Meet
        </button>
      </div>
    </div>
  );
};

export default VideoTest;
