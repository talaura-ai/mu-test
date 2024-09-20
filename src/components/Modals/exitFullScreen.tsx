import { ReactSVG } from "react-svg";
import ExitFullScreenIcon from "../../assets/svg/exitFullScreenIcon.svg";

interface ExitFullScreenModalProps {
  onPress: (val: string) => void;
}
export default function ExitFullScreenModal(props: ExitFullScreenModalProps) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative mx-auto sm:w-[550px] w-[90%]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center sm:py-10 py-4 bg-[#FFF6ED]">
                <ReactSVG src={ExitFullScreenIcon} />
              </div>
              <p className="text-black leading-relaxed sm:pt-6 pt-2 px-6 font-sansation font-bold sm:text-[18px] text-[16px] text-center">
                Are you sure you want to exit full screen?
              </p>
              <p className="text-black leading-relaxed px-6 pt-2 pb-4 font-sansation font-medium sm:text-[16px] text-[14px] text-center">
                if you exit full screen your exam will be submitted
                automatically
              </p>
            </div>
            <div className="flex items-center justify-center px-6 pb-6 gap-4 mt-4">
              <button
                onClick={() => {
                  props?.onPress("cancel");
                }}
                type="button"
                className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 sm:py-2 py-1 text-center inline-flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  props?.onPress("exit");
                }}
                type="button"
                className="text-white ml-2 bg-[#CC8448] font-medium font-sansation rounded-md text-lg w-40 sm:py-2 py-1 text-center inline-flex items-center justify-center"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
