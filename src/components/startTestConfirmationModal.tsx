import { ReactSVG } from "react-svg";
import GrayCloseIcon from "../assets/svg/closeIconGray.svg";
import QuizInstructions from "./Instructions/quiz";
import CodingInstructions from "./Instructions/sandbox";
import VoiceToTextInstructions from "./Instructions/voiceToText";
import VoiceToVideoInstructions from "./Instructions/voiceToVideo";

export default function StartTestConfirmationModal(props: any) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none font-sansation ">
        <div className="relative sm:w-full w-[92%] my-6 mx-auto max-w-xl">
          {/*content*/}
          <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden">
            {/*header*/}
            <div className="relative flex items-center py-3 justify-center border-solid border-t-8 border-[#FFAC3A]">
              <h3 className="sm:text-[24px] text-[14px] text-black font-semibold sm:w-auto w-[75%] sm:text-left text-center">
                {props?.selectedTest?.name}
              </h3>
              <button
                className="absolute border-0 text-3xl leading-none font-semibold outline-none top-0 right-3 bottom-0"
                onClick={() => {
                  props?.onClose();
                }}
              >
                <ReactSVG src={GrayCloseIcon} />
              </button>
            </div>
            <div className="sm:min-h-[450px] sm:max-h-[550px] min-h-[300px] max-h-[260px] overflow-y-scroll overflow-x-hidden">
              {/*body*/}
              {String(props?.selectedTest?.type).toLocaleLowerCase() ===
              "Quiz"?.toLocaleLowerCase() ? (
                <QuizInstructions test={props?.selectedTest} />
              ) : null}
              {String(props?.selectedTest?.type).toLocaleLowerCase() ===
              "Voice To Text"?.toLocaleLowerCase() ? (
                <VoiceToTextInstructions test={props?.selectedTest} />
              ) : null}
              {String(props?.selectedTest?.type).toLocaleLowerCase() ===
              "Voice To Voice"?.toLocaleLowerCase() ? (
                <VoiceToVideoInstructions test={props?.selectedTest} />
              ) : null}
              {String(props?.selectedTest?.type).toLocaleLowerCase() ===
              "AI Video Interview"?.toLocaleLowerCase() ? (
                <VoiceToVideoInstructions test={props?.selectedTest} />
              ) : null}
              {String(props?.selectedTest?.type).toLocaleLowerCase() ===
              "Sandbox"?.toLocaleLowerCase() ? (
                <CodingInstructions test={props?.selectedTest} />
              ) : null}
            </div>
            <div className="flex items-center justify-center border-t-[#CCC] border-t border-solid sm:py-4 py-2">
              <button
                onClick={() => {
                  props?.onClose();
                }}
                type="button"
                className="text-black border-black border mr-2 font-medium rounded-md text-lg sm:w-40 w-28 sm:py-2 py-1 text-center inline-flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  props?.onNextClicked();
                }}
                type="button"
                className="text-white ml-2 bg-[#CC8448] font-medium rounded-md text-lg sm:w-40 w-28 sm:py-2 py-1 text-center inline-flex items-center justify-center"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
