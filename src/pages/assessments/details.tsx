import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UnlockNextIcon from "../../assets/svg/unlockNext.svg";
import LockNextIcon from "../../assets/svg/lockIcon.svg";
import StartTestConfirmationModal from "../../components/startTestConfirmationModal";
import AssessmentCard from "../../components/assessmentCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setAssessmentDispatcher,
  setAssessmentModuleDispatcher,
  setLoadingDispatcher,
  setQuizLoadingDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { toast } from "react-toastify";
import CompletedIcon from "../../assets/svg/completedIcon.svg";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import InternetSpeedModal from "../../components/Modals/internetSpeedModal";
import moment from "moment";
import TestDeviceConfigModal from "../../components/ConfigTestModal";
import { useNetworkState } from "react-use";
import screenfull from "screenfull";
import ErrorModal from "../../components/Modals/errorModal";
import { ReactSVG } from "react-svg";
import { detectBrowser } from "../../utils";

function AssessmentDetails() {
  const navigate = useNavigate();
  const [startTestModal, setStartTestModal] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<any>({});
  const dispatcher = useAppDispatch();
  const { assessmentId, userId } = useParams();
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const [assessmentExpired, setAssessmentExpired] =
    React.useState<boolean>(false);
  const [checkSpeed, setCheckSpeed] = React.useState(0);
  const [speedLaoding, setSpeedLaoding] = React.useState(true);
  const [testConfigCheckModal, setTestConfigCheckModal] = React.useState(false);
  const [speedTestLaoding, setSpeedTestLaoding] = React.useState(false);
  const [errorModalObj, setErrorModalObj] = React.useState({
    visible: false,
    text: "",
  });
  const [cameraChecking, setCameraChecking] = React.useState(0);
  const [audioChecking, setAudioChecking] = React.useState(0);
  const [networkChecking, setNetworkChecking] = React.useState(0);
  const [assessmentEndsOn, setAssessmentEndsOn] = React.useState<any>(null);

  const state = useNetworkState();

  const types: any = {
    quiz: "Quiz",
    "voice to voice": "Voice to Voice",
    "voice to text": "Text to Text",
    "ai video interview": "AI Video Interview",
    sandbox: "Sandbox",
  };

  const location = useLocation();
  useEffect(() => {
    checkMicrophonePermission();
    checkCameraAccess();
  }, []);

  useEffect(() => {
    if (state) {
      setNetworkChecking(state?.online ? 1 : 2);
    }
  }, [state]);

  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioChecking(1);
    } catch (err) {
      setAudioChecking(2);
    }
  };

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCameraChecking(1);
    } catch (err: any) {
      setCameraChecking(2);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }));
    }
  }, [location]);

  // //Disable Right click
  if (document.addEventListener) {
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  const onNextClicked = () => {
    setStartTestModal(false);
    getTestData(selectedTest?._id);
    const element: any = document.getElementById("fullscreenDiv");
    if (element) {
      screenfull.request(element);
    }
  };

  const getTestData = async (testId: string) => {
    try {
      const type = String(selectedTest?.type).toLocaleLowerCase();
      if (type === "Quiz"?.toLocaleLowerCase()) {
        dispatcher(setQuizLoadingDispatcher(true));
      } else {
        dispatcher(setLoadingDispatcher(true));
      }
      const res = await dispatcher(
        setAssessmentModuleDispatcher({
          moduleId: testId,
          candidateId: userId,
          assessmentId: assessmentId,
        })
      );
      dispatcher(setQuizLoadingDispatcher(false));
      dispatcher(setLoadingDispatcher(false));
      if (res?.payload?.data?.status) {
        const { module } = res?.payload?.data;
        if (
          !module?.isLocked &&
          module?.question?.length > 0 &&
          ["Not Started"]?.includes(module?.status)
        ) {
          startTest();
        }
      } else {
        if (res?.payload?.error) {
          // toast.error(res?.payload?.error?.message, {});
          setErrorModalObj({
            visible: true,
            text: res?.payload?.error?.message,
          });
        }
      }
    } catch (error) {
      console.log("res=> error", error);
      dispatcher(setQuizLoadingDispatcher(false));
      dispatcher(setLoadingDispatcher(false));
    }
  };
  const startTest = () => {
    sessionStorage.setItem("screen-exit-time", moment().toISOString());
    const type = String(selectedTest?.type).toLocaleLowerCase();
    if (type === "Quiz"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}`);
    } else if (type === "Sandbox"?.toLocaleLowerCase()) {
      navigate(
        `/assessment/${userId}/${assessmentId}/${selectedTest?._id}/coding`
      );
    } else if (type === "Voice To Voice"?.toLocaleLowerCase()) {
      navigate(
        `/assessment/${userId}/${assessmentId}/${selectedTest?._id}/voice-to-voice`
      );
    } else if (type === "Voice To Text"?.toLocaleLowerCase()) {
      navigate(
        `/assessment/${userId}/${assessmentId}/${selectedTest?._id}/voice-to-text`
      );
    } else if (type === "AI Video Interview"?.toLocaleLowerCase()) {
      navigate(
        `/assessment/${userId}/${assessmentId}/${selectedTest?._id}/video-interview`
      );
    }
  };
  const checkInternetSpeed = () => {
    if (
      cameraChecking === 1 &&
      audioChecking === 1 &&
      networkChecking === 1 &&
      Math.ceil(checkSpeed) >= 5
    ) {
      onNextClicked();
    } else {
      if (
        cameraChecking !== 1 ||
        audioChecking !== 1 ||
        networkChecking !== 1
      ) {
        setTestConfigCheckModal(true);
        setStartTestModal(false);
      } else {
        if (Math.ceil(checkSpeed) < 5) {
          setStartTestModal(false);
          setSpeedTestLaoding(true);
        }
      }
    }
  };

  const checkDevTools = () => {
    let h = detectBrowser() === "Edge" ? 200 : 121;
    let w = detectBrowser() === "Edge" ? 300 : 50;
    const widthThreshold = window.outerWidth - window.innerWidth > w;
    const heightThreshold = window.outerHeight - window.innerHeight > h;
    // if (widthThreshold || heightThreshold) {
    //   toast.error(
    //     `Alert: Your Dev Tools Opened, Please close them before proceed!`,
    //     {}
    //   );
    // }
    // else {
    checkInternetSpeed();
    // }
  };

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(
        (v) => v?.assessmentId === assessmentId
      );
      let assessmentData = [...data?.[0]?.module];
      const newData = assessmentData?.sort(
        (a: any, b: any) => Number(a?.position || 0) - Number(b?.position || 0)
      );
      setSelectAssessment({ module: newData });
      setAssessmentEndsOn(data?.[0]?.endsOn || null);
    } else {
      setSelectAssessment({});
      setAssessmentEndsOn(null);
    }
  }, [myAssessments, assessmentId]);

  React.useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }));
    }
  }, [dispatcher, userId]);

  const onExpired = () => {
    setAssessmentExpired(true);
  };
  const onClose = () => {
    setSpeedTestLaoding(false);
  };
  const onErrorClose = () => {
    setErrorModalObj({ visible: false, text: "" });
    const element: any = document.getElementById("fullscreenDiv");
    if (element && screenfull?.isFullscreen) {
      screenfull.toggle(element);
    }
  };
  const onStartTest = (item: any) => {
    if (assessmentEndsOn) {
      if (moment(assessmentEndsOn).diff(moment(), "seconds") <= 0) {
        setErrorModalObj({ visible: true, text: "Assessment time expired!" });
      } else {
        setStartTestModal(true);
        setSelectedTest(item);
      }
    } else {
      setErrorModalObj({ visible: true, text: "Assessment time expired!" });
    }
  };
  return (
    <>
      <ReactInternetSpeedMeter
        outputType=""
        pingInterval={1000} // milliseconds
        thresholdUnit="megabyte" // "byte" , "kilobyte", "megabyte"
        threshold={5}
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
        downloadSize="500000" //bytes
        callbackFunctionOnNetworkDown={(data: any) =>
          console.log(`callbackFunctionOnNetworkDown Internet speed : ${data}`)
        }
        callbackFunctionOnNetworkTest={(data: any) => {
          setCheckSpeed(data);
          setSpeedLaoding(false);
        }}
      />
      <div className="sm:p-8 md:px-20 md:py-12 p-4">
        <AssessmentCard onExpired={() => onExpired()} />
        {selectAssessment?.module?.map((item: any) => (
          <div
            key={item}
            className="flex sm:flex-row flex-col flex-wrap justify-around mb-10 rounded-2xl relative sm:py-6 py-2 bg-white shadow-lg sm:mx-[150px] mx-0"
          >
            <div className="absolute top-0 left-0 bottom-auto h-full flex items-center">
              <div className="w-[10px] h-[70%] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl"></div>
            </div>
            <div className="absolute -top-6 -left-4">
              {item?.status === "Completed" ? (
                <ReactSVG src={CompletedIcon} />
              ) : !item?.isLocked ? (
                <ReactSVG src={UnlockNextIcon} />
              ) : (
                <ReactSVG src={LockNextIcon} />
              )}
            </div>
            <div className="flex sm:flex-col flex-row justify-between items-center sm:py-4 py-3 md:w-[45%] sm:w-full sm:pr-6 sm:pl-10 pr-4 pl-4 ">
              <span className="sm:text-[22px] text-[14px] font-semibold text-[#F2BC84] font-sansation">
                {types[String(item?.type).toLowerCase()]}
              </span>
              <div className="sm:hidden flex flex-col text-center">
                {["Completed"].includes(item?.status) ? (
                  <button
                    type="button"
                    className="text-white bg-[#CC8448]/80 font-sansation tracking-wide font-medium rounded-lg text-md sm:px-6 px-3 sm:py-2.5 py-1.5 text-center inline-flex items-center cursor-not-allowed"
                  >
                    Completed
                  </button>
                ) : null}
                {["Pending"].includes(item?.status) ? (
                  <button
                    type="button"
                    className="text-white bg-[#EE4B2B]/80 font-sansation tracking-wide font-medium rounded-lg text-md sm:px-6 px-3 sm:py-2.5 py-1.5  text-center inline-flex items-center cursor-not-allowed"
                  >
                    Interrupted
                  </button>
                ) : null}
                {["Not Started"].includes(item?.status) ? (
                  <button
                    type="button"
                    disabled={item?.isLocked || assessmentExpired}
                    onClick={() => {
                      onStartTest(item);
                    }}
                    className={`text-white bg-[#CC8448] hover:bg-[#CC8448]/80 ${
                      item?.isLocked || assessmentExpired
                        ? "bg-[#CC8448]/80 cursor-not-allowed"
                        : ""
                    } font-sansation focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md sm:px-12 px-5 sm:py-2.5 py-1.5 text-center inline-flex items-center`}
                  >
                    Start
                  </button>
                ) : null}
              </div>
            </div>
            {/* <div className="flex flex-col md:w-[20%] sm:w-full px-4 justify-center ">
              <span className="text-[20px] font-normal text-black font-sansation">Skills</span>
              <span className="text-[14px] font-medium text-[#BDBDBD] font-sansation">
                { item?.skills?.join(", ") }
              </span>
            </div> */}
            <div className="flex sm:justify-around md:justify-around md:w-[55%] items-center justify-center sm:w-full px-2 sm:pb-0 pb-2">
              {item?.type.toLowerCase() !== "ai video interview" ? (
                <div className="flex flex-col text-center">
                  <span className="sm:text-[20px] text-[10px] font-normal text-black font-sansation">
                    Questions
                  </span>

                  <span className="sm:text-[20px] text-[10px] font-semibold text-[#BDBDBD] font-sansation">
                    {item?.noOfQuestions || 0}
                  </span>
                </div>
              ) : null}

              {/* <div className="flex flex-col text-center items-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Weightage
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] min-w-[50px] border-b border-[#E5A971] font-sansation">
                  { item?.weightage || 0 }%
                </span>
              </div> */}
              <div className="flex flex-col text-center">
                <span className="sm:text-[20px] text-[10px] font-normal text-black font-sansation">
                  Duration
                </span>
                <span className="sm:text-[20px] text-[10px] font-semibold text-[#BDBDBD] font-sansation">
                  {item?.time || 0} min
                </span>
              </div>
              <div className="sm:flex hidden flex-col text-center">
                {["Completed"].includes(item?.status) ? (
                  <button
                    type="button"
                    className="text-white bg-[#CC8448]/80 font-sansation tracking-wide font-medium rounded-lg text-md px-6 py-2.5 text-center inline-flex items-center cursor-not-allowed"
                  >
                    Completed
                  </button>
                ) : null}
                {["Pending"].includes(item?.status) ? (
                  <button
                    type="button"
                    className="text-white bg-[#EE4B2B]/80 font-sansation tracking-wide font-medium rounded-lg text-md px-6 py-2.5 text-center inline-flex items-center cursor-not-allowed"
                  >
                    Interrupted
                  </button>
                ) : null}
                {["Not Started"].includes(item?.status) ? (
                  <button
                    type="button"
                    disabled={item?.isLocked || assessmentExpired}
                    onClick={() => {
                      onStartTest(item);
                    }}
                    className={`text-white bg-[#CC8448] hover:bg-[#CC8448]/80 ${
                      item?.isLocked || assessmentExpired
                        ? "bg-[#CC8448]/80 cursor-not-allowed"
                        : ""
                    } font-sansation focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center`}
                  >
                    Start
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      {startTestModal && (
        <StartTestConfirmationModal
          onClose={() => {
            setStartTestModal(false);
          }}
          onNextClicked={checkDevTools}
          selectedTest={selectedTest}
        />
      )}
      {speedTestLaoding && (
        <InternetSpeedModal
          onClose={() => {
            onClose();
          }}
        />
      )}
      {testConfigCheckModal && (
        <TestDeviceConfigModal
          cameraChecking={cameraChecking}
          audioChecking={audioChecking}
          networkChecking={networkChecking}
          checkSpeed={checkSpeed}
          speedLaoding={speedLaoding}
          onClose={() => {
            setTestConfigCheckModal(false);
          }}
        />
      )}
      {errorModalObj?.visible ? (
        <ErrorModal
          onClose={() => {
            onErrorClose();
          }}
          text={errorModalObj?.text}
        />
      ) : null}
    </>
  );
}

export default AssessmentDetails;
