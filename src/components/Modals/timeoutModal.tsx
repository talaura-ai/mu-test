import TimeoutIcon from "../../assets/svg/Time.svg"
import { ReactSVG } from "react-svg";
interface TimeoutModalProps {
  onClose: () => void
}
export default function ModuleTimeoutModal (props: TimeoutModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative mx-auto w-[550px]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center py-8 bg-[#FFF6ED]">
                <ReactSVG src={ TimeoutIcon } />
              </div>
              <p className="text-black leading-relaxed pt-6 px-6 font-sansation font-bold text-[18px] text-center">
                Timeout for this module
              </p>
              <p className="text-black leading-relaxed px-6 py-2 pb-8 font-sansation font-medium text-[16px] text-center">
                Your exam was submitted automatically.
              </p>
            </div>
            <div className="flex items-center justify-center px-6 pb-6">
              <button onClick={ () => { props?.onClose?.() } } type="button" className="text-white ml-2 bg-[#CC8448] font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center">
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
