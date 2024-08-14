import { ReactSVG } from "react-svg";
import speedIcon from "../../assets/svg/speedIcon.svg";

const CustomSpeedChecker = ({ message, onClose }: any) => {

  return (
    <div className="flex items-center justify-center w-[60%] mx-auto left-0 right-0 absolute top-32 animate-slide-down z-10">
      <div
        id="toast-warning"
        className="flex items-center justify-center w-full max-w-[350px] px-4 py-3  bg-[#FBCECE]/80 rounded-lg shadow border-[#FB2121] border-[2px] -mt-10"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-md ">
          <ReactSVG src={ speedIcon } />
        </div>
        <div className="ms-8 text-sm font-normal text-black toast__content text-center">
          Please check internet connection
          Current speed below 5 Mbps
        </div>
      </div>
    </div>
  );
};

export default CustomSpeedChecker;
