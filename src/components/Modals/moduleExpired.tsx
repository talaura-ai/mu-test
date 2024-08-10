import { ReactSVG } from "react-svg";
import TimeLeftIcon from "../../assets/svg/timeLeftIcon.svg";

interface InternetSpeedModalProps {
  onClose: () => void
}
export default function ModuleExpiredModal (props: InternetSpeedModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative mx-auto w-[550px]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center py-8 bg-[#FFF6ED]">
                <ReactSVG src={ TimeLeftIcon } className="w-16" />
              </div>
              <p className="text-black leading-relaxed pt-8 px-6 py-2 pb-8 font-sansation font-medium text-[16px] text-center">
                Your assessment has expired.
              </p>
            </div>
            <div className="flex items-center justify-center px-6 pb-6">
              <button onClick={ () => { props?.onClose() } } type="button" className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
