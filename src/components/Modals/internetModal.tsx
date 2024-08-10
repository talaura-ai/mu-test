import { ReactSVG } from "react-svg";
import InternetIcon from "../../assets/svg/Internet.svg"

interface InternetModalProps { }
export default function InternetModal (props: InternetModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative mx-auto w-[550px]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center py-8 bg-[#FFF6ED]">
                <ReactSVG src={ InternetIcon } />
              </div>
              <p className="text-black leading-relaxed pt-6 px-6 font-sansation font-bold text-[18px] text-center">
                You are offline
              </p>
              <p className="text-black leading-relaxed px-6 py-2 pb-8 font-sansation font-medium text-[16px] text-center">
                Please check your internet connection
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
