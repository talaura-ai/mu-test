import { useEffect, useState } from "react";
import { useNetworkState } from "react-use";
import ReactLoading from "react-loading";
import { MdError } from "react-icons/md";
import CloseIcon from "../assets/svg/closeIcon.svg";
import CheckedIcon from "../assets/svg/checkedIcon.svg";
import WifiIcon from "../assets/svg/wifiIcon.svg";
import ScreenSharing from "../assets/svg/screenSharing.svg";
import CameraIcon from "../assets/svg/cameraIcon.svg";
import MicIcon from "../assets/svg/micIcon.svg";
import React from "react";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import { ReactSVG } from "react-svg";

const data = [
  { name: "Mic", icon: MicIcon },
  { name: "Camera", icon: CameraIcon },
  { name: "Internet", icon: WifiIcon },
  { name: "Screen Sharing", icon: ScreenSharing },
];

export default function DeviceConfigTestModal(props: any) {
  const [cameraChecking, setCameraChecking] = useState(0);
  const [speedLaoding, setSpeedLaoding] = useState(true);
  const [isChecboxClicked, setIsChecboxClicked] = useState(false);
  const [audioChecking, setAudioChecking] = useState(0);
  const [networkChecking, setNetworkChecking] = useState(0);
  const state = useNetworkState();
  const [checkSpeed, setCheckSpeed] = React.useState(0);

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

  const renderIcons: any = {
    0: <ReactLoading type={"spin"} color="#CC8448" height={24} width={24} />,
    1: <ReactSVG src={CheckedIcon} />,
    2: <MdError color="#F00" size={28} />,
  };

  const getStatus = (name: string) => {
    if (name === "Mic") {
      return audioChecking;
    }
    if (name === "Camera") {
      return cameraChecking;
    }
    if (name === "Internet") {
      return speedLaoding ? 0 : networkChecking;
    }
    if (name === "Screen Sharing") {
      return 1;
    }
    return 0;
  };

  const getBtnStatus = () => {
    if (
      !isChecboxClicked ||
      !(!speedLaoding && networkChecking === 1) ||
      !(cameraChecking === 1) ||
      !(audioChecking === 1)
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <ReactInternetSpeedMeter
          outputType=""
          pingInterval={2000} // milliseconds
          thresholdUnit="megabyte" // "byte" , "kilobyte", "megabyte"
          threshold={5}
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
          downloadSize="500000" //bytes
          callbackFunctionOnNetworkDown={(data: any) =>
            console.log(
              `callbackFunctionOnNetworkDown Internet speed : ${data}`
            )
          }
          callbackFunctionOnNetworkTest={(data: any) => {
            setCheckSpeed(data);
            setSpeedLaoding(false);
          }}
        />
        <div className="relative sm:w-full w-[90%] my-6 mx-auto max-w-lg">
          <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-[#F9F7F0] outline-none focus:outline-none sm:px-6 px-0">
            <div className="relative flex items-center py-3 justify-center border-solid border-b-2 border-[#BDBDBD] rounded-t">
              <h3 className="sm:text-[24px] text-[20px] text-[#F2BC84] font-semibold font-sansation">
                Device Config Test
              </h3>
              <button
                className="absolute border-0 text-3xl leading-none font-semibold outline-none top-0 right-0 bottom-0 sm:mr-0 mr-6"
                onClick={() => {
                  props?.onClose();
                }}
              >
                <ReactSVG src={CloseIcon} />
              </button>
            </div>
            <div className="sm:py-8 py-2 px-3 flex-auto">
              {data.map((item) => (
                <div
                  key={item?.name}
                  className="flex flex-wrap items-center justify-between sm:mb-8 mb-2 rounded-2xl bg-white relative sm:px-6 px-2 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]"
                >
                  <div className="w-[10px] sm:h-[70%] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl absolute top-auto left-0 bottom-auto"></div>
                  <div className="flex items-center justify-center sm:py-6 py-2 pl-2 gap-4">
                    <ReactSVG src={item?.icon} />
                    <span className="sm:text-[24px] text-[14px] font-medium text-black self-center font-sansation">
                      {item?.name}
                    </span>
                    {item?.name === "Internet" ? (
                      <>
                        {speedLaoding ? (
                          <>
                            <ReactLoading
                              type={"spin"}
                              color="#CC8448"
                              height={24}
                              width={24}
                            />
                          </>
                        ) : (
                          <span className="text-[12px] font-medium text-[#BDBDBD] self-center pt-1 font-sansation">
                            {Math.ceil(checkSpeed)} mbps
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center sm:py-6">
                    {renderIcons[getStatus(item?.name)]}
                  </div>
                </div>
              ))}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setIsChecboxClicked(!isChecboxClicked);
                }}
              >
                <input
                  type="checkbox"
                  value=""
                  checked={isChecboxClicked}
                  className="w-7 h-7 text-[#CC8448] bg-gray-100 border-gray-200 rounded accent-[#CC8448] cursor-pointer"
                />
                <label className="ms-2 sm:mt-0 mt-2 font-medium sm:text-[14px] text-[11px] text-black font-sansation cursor-pointer">
                  By clicking "I Agree," you acknowledge that you are granting
                  permission for the access mentioned above
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center px-6 sm:pb-6 pb-3">
              <button
                onClick={() => {
                  props?.onNextClicked();
                }}
                disabled={getBtnStatus()}
                type="button"
                className={`font-sansation text-white ${
                  !getBtnStatus()
                    ? "bg-[#CC8448] hover:bg-[#CC8448]/80"
                    : "bg-[#CC8448]/60 cursor-not-allowed"
                } focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 sm:py-2.5 py-1.5 text-center inline-flex items-center`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
