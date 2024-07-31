import { useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { memo, useEffect, useState } from "react";
import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { useAppDispatch } from "../store/hooks";
import { getUserActivityDispatcher } from "../store/slices/dashboard-slice/dashboard-dispatchers";

const width = 650;
const height = 650;

const FaceDetectionComponent = (props: any) => {
  const dispatcher = useAppDispatch();
  const { assessmentId, testId, userId } = useParams();
  const [isToasterDisplayed, setIsToasterDisplayed] = useState(false);
  const [cameraStats, setCameraStats] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  let toasterTimeout: any = null;

  const { webcamRef, detected, facesDetected }: any =
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
      displayToasterFun("Face not detected");
      updateUserActivity();
    }
    if (
      facesDetected > 1 &&
      !isToasterDisplayed &&
      cameraStats &&
      cameraReady
    ) {
      displayToasterFun("Multiple face detected");
      updateUserActivity();
    }
  }, [detected, facesDetected, cameraStats, cameraReady]);

  const displayToasterFun = (msg: string) => {
    clearTimeout(toasterTimeout);
    toasterTimeout = setTimeout(() => {
      props?.onRefChange?.(false, msg)
    }, 1000);
    props?.onRefChange?.(true, msg)
  };

  const updateUserActivity = () => {
    dispatcher(
      getUserActivityDispatcher({
        candidateId: userId,
      })
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setCameraReady(true);
    }, 4000);
    return () => {
      if (webcamRef?.current) {
        webcamRef?.current?.video?.srcObject
          ?.getTracks()
          ?.forEach((track: any) => track?.stop());
        webcamRef.current.video.srcObject = null;
      }
    };
  }, []);

  return (
    <>
      <Webcam
        ref={ webcamRef }
        forceScreenshotSourceSize
        onUserMedia={ () => {
          setCameraStats(true);
        } }
        onUserMediaError={ () => {
          setCameraStats(false);
        } }
        style={ {
          height,
          width,
          position: "absolute",
          display: "none",
        } }
      />
    </>
  );
}

export default memo(FaceDetectionComponent);
