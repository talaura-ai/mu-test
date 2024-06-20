import MultiUserIcon from "../../assets/svg/multiUserIcon.svg";
import AiBot from "../../assets/AiBot.png";
import VideoCallUser from "../../assets/VideoCallUser.png";
import VoiceIcon from "../../assets/Group 171.png";
import MicIcon from "../../assets/svg/micIcon2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import "@tensorflow/tfjs";
var count_facedetect = 0;

const VideoTest = () => {
  const webcamRef = useRef<any>(null);
  const elementRef = useRef<any>(null);
  let videoRef = useRef<any>();
  let canvasRef = useRef<any>();
  // const webcamRef=useRef(null);
  // const canvasRef=useRef(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  const noOfUser = 3;
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(true);

  // //Disable Right click
  // if (document.addEventListener) {
  //   document.addEventListener('contextmenu', function (e) {
  //     e.preventDefault();
  //   }, false);
  // }


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMediaRecorder(new MediaRecorder(stream));
    });
    // runPosenet();
  }, []); // Setup mediaRecorder initially

  useEffect(() => {
    if (mediaRecorder) {
      const socket = io("ws://34.100.209.222:4000");
      console.log("websocket");
      socket.on("connect", async () => {
        console.log("client connected to websocket");
        mediaRecorder.addEventListener("dataavailable", (event) => {
          console.log('dataavailable', event)
          if (event?.data?.size > 0) {
            console.log('packet-sent')
            socket.emit("packet-sent", event.data);
          }
        });
        mediaRecorder.start(500);
      });
      socket.on("disconnect", () => {
        console.log("disconnect", socket.id); // undefined
      });
      socket.on("connect_error", (error) => {
        console.log("connect_error", error);
      });
      socket.on("audioData", (arrayBuffer) => {
        setIsRecording(false);
        console.log('audioData')
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);

        const audioElement = new Audio(audioUrl);
        audioElement.onended = () => setIsRecording(true);
        audioElement.play();
      });

      return () => {
        console.log('RETURNED')
        socket.disconnect(); // Clean up the socket connection on component unmount
      };
    }
  }, [mediaRecorder]);

  console.log(mediaRecorder, isRecording)
  useEffect(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      if (isRecording) {
        mediaRecorder.resume();
      } else {
        mediaRecorder.pause();
      }
    }
  }, [isRecording, mediaRecorder]);

  // useEffect(() => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     const webCamPromise = navigator.mediaDevices
  //       .getUserMedia({
  //         audio: false,
  //         video: {
  //           facingMode: "user",
  //           width: 500,
  //           height: 300
  //         }
  //       })
  //       .then(stream => {
  //         window.stream = stream;
  //         videoRef.current.srcObject = stream;
  //         return new Promise((resolve, reject) => {
  //           videoRef.current.onloadedmetadata = () => {
  //             resolve(true);
  //           };
  //         });
  //       });
  //     const modelPromise = cocoSsd.load();
  //     Promise.all([modelPromise, webCamPromise])
  //       .then(values => {
  //         detectFrame(videoRef.current, values[0]);
  //       })
  //       .catch(error => {
  //         //console.error(error);
  //       });
  //   }
  // }, [])

  // const detectFrame = (video: any, model: any) => {
  //   model.detect(video).then((predictions: any) => {
  //     if (canvasRef.current) {

  //       renderPredictions(predictions);
  //       requestAnimationFrame(() => {
  //         detectFrame(video, model);
  //       });
  //     } else {
  //       return false;
  //     }
  //   });
  // };

  // const renderPredictions = (predictions: any) => {
  //   //var count=100;
  //   const ctx = canvasRef.current.getContext("2d");
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   // Font options.
  //   const font = "16px sans-serif";
  //   ctx.font = font;
  //   ctx.textBaseline = "top";
  //   predictions.forEach((prediction: any) => {

  //     const x = prediction.bbox[0];
  //     const y = prediction.bbox[1];
  //     const width = prediction.bbox[2];
  //     const height = prediction.bbox[3];
  //     // Draw the bounding box.
  //     ctx.strokeStyle = "#00FFFF";
  //     ctx.lineWidth = 2;
  //     ctx.strokeRect(x, y, width, height);
  //     // Draw the label background.
  //     ctx.fillStyle = "#00FFFF";
  //     const textWidth = ctx.measureText(prediction.class).width;
  //     const textHeight = parseInt(font, 10); // base 10
  //     ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

  //     var multiple_face = 0;
  //     for (let i = 0; i < predictions.length; i++) {

  //       //Face,object detection
  //       if (predictions[i].class === "cell phone") {
  //         console.log("Cell Phone Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       }
  //       else if (predictions[i].class === "book") {
  //         console.log("Object Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       }
  //       else if (predictions[i].class === "laptop") {
  //         console.log("Object Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       }
  //       else if (predictions[i].class !== "person") {
  //         console.log("Face Not Visible", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       }
  //     }
  //   });

  //   predictions.forEach((prediction: any) => {
  //     const x = prediction.bbox[0];
  //     const y = prediction.bbox[1];
  //     //console.log(predictions)
  //     // Draw the text last to ensure it's on top.
  //     ctx.fillStyle = "#000000";
  //     //console.log(prediction.class);

  //     if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
  //       ctx.fillText(prediction.class, x, y);
  //     }
  //   });
  //   //console.log("final")
  //   console.log(count_facedetect)
  //   // sessionStorage.setItem("count_facedetect", count_facedetect);

  // };

  // //  Load posenet
  // const runPosenet = async () => {
  //   const net = await posenet.load({
  //     architecture: 'ResNet50',
  //     quantBytes: 2,
  //     inputResolution: { width: 640, height: 480 },
  //     outputStride: 16
  //     // scale: 1,
  //   });
  //   //
  //   setInterval(() => {
  //     detect(net);
  //   }, 1000);
  // };

  // const detect = async (net: any) => {
  //   if (
  //     typeof webcamRef.current !== "undefined" &&
  //     webcamRef.current !== null &&
  //     webcamRef.current.video.readyState === 4
  //   ) {
  //     // Get Video Properties
  //     const video = webcamRef.current.video;
  //     const videoWidth = webcamRef.current.video.videoWidth;
  //     const videoHeight = webcamRef.current.video.videoHeight;

  //     // Set video width
  //     webcamRef.current.video.width = videoWidth;
  //     webcamRef.current.video.height = videoHeight;

  //     // Make Detections
  //     const pose = await net.estimateSinglePose(video);
  //     // console.log(pose);

  //     EarsDetect(pose["keypoints"], 0.8);

  //     // drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
  //   }
  // };

  // // const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
  // //   const ctx = canvas.current.getContext("2d");
  // //   canvas.current.width = videoWidth;
  // //   canvas.current.height = videoHeight;

  // //   drawKeypoints(pose["keypoints"], 0.6, ctx);
  // //   drawSkeleton(pose["keypoints"], 0.7, ctx);
  // // };

  // const EarsDetect = (keypoints: any, minConfidence: any) => {
  //   //console.log("Checked")
  //   const keypointEarR = keypoints[3];
  //   const keypointEarL = keypoints[4];

  //   if (keypointEarL.score < minConfidence) {
  //     console.log("You looked away from the Screen (To the Right)")
  //   }
  //   if (keypointEarR.score < minConfidence) {
  //     console.log("You looked away from the Screen (To the Left)")
  //   }
  // }

  return (
    <div ref={ elementRef } className="sm:p-6 md:px-20 md:py-12 p-4">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-6 border-b-2 border-[#7d7c78] pb-4 font-sansation">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            Module 2: Video Round
          </span>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="w-full flex items-center">
            <p className="text-[18px] text-black font-normal mr-10">3:24:45</p>
            <img src={ MultiUserIcon } className="px-2" alt="left icon" />
            <span className="text-[24px] font-semibold text-[#a7a6a0]">
              { noOfUser }
            </span>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col  md:justify-center gap-4">
        <div className="flex flex-col w-[80%] h-1/2 md:flex-row justify-between ">
          <div className="flex relative h-1/2 w-1/2 ">
            <img src={ AiBot } className="px-2" alt="left icon" />
            <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
              Ai Bot
            </div>
            <div className="absolute right-10 bottom-4  text-white  px-4 py-1  ">
              <img src={ MicIcon } className="h-8 w-10" alt="mic" />
            </div>
          </div>
          <div className="flex relative h-1/2 w-1/2 ">
            <div className="flex rounded-xl w-full overflow-hidden h-full">
              {/* <img src={ VideoCallUser } className="px-2" alt="left icon" /> */ }
              <Webcam
                ref={ webcamRef }
                className="w-full h-full"
              // style={ {
              //   // position: "absolute",
              //   // marginLeft: "auto",
              //   // marginRight: "auto",
              //   // left: 0,
              //   // right: 0,
              //   // textAlign: "center",
              //   // zIndex: 9,
              //   // width: 640,
              //   // height: 480,
              // } }
              />
              {/* <div>
                <video
                  className="size"
                  autoPlay
                  playsInline
                  muted
                  ref={ videoRef }
                  width="500"
                  height="300"
                />
                <canvas
                  className="size"
                  ref={ canvasRef }
                  width="500"
                  height="300"
                />
              </div> */}
              <div>
                {/* <Webcam
                  ref={ webcamRef }
                  style={ {
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480,
                  } }
                /> */}

                {/* <canvas
                  ref={ canvasRef }
                  style={ {
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480,
                  } }
                /> */}
              </div>
              <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
                Manisha
              </div>
              <div className="absolute right-6 bottom-4  text-white  px-4 py-1  ">
                <img src={ MicIcon } className="h-8 w-10" alt="mic" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[20%]  bg-white shadow rounded-lg p-4">
          {/* <div className=" flex justify-center w-full">
            <img
              src={ LanguageIcon }
              className="px-2 bg-[#FFEFDF]"
              alt="left icon"
            />
          </div>
          <div className="flex ">
            <img src={ ChatIcon } className="px-2" alt="left icon" />
          </div> */}
          <div className="flex h-1/2 w-full flex-col">
            <div className="flex gap-2">
              <img src={ VoiceIcon } alt="icn" />
              <span className="text-xs text-gray-300 mt-2">CC/Subtitle </span>
            </div>
            <div className="flex mx-10 bg-white ">
              <span>
                Hi how are you doing?
                <br />
                Im doing well how about you?
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center py-6 font-sansation">
        <img src={ Caption } alt="caption" />
      </div> */}
      <div className="flex justify-center py-6 font-sansation">
        <button
          className="flex justify-center bg-[#E04747] px-3 py-2 rounded-lg text-white font-semibold"
          onClick={ () => navigate(`/assessment/${userId}/dashboard`) }
        >
          End Meet
        </button>
      </div>
    </div>
  );
};

export default VideoTest;
