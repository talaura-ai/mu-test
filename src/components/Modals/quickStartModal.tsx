import InternetIcon from "../../assets/svg/Internet.svg"
import WifiIcon from "../../assets/svg/wifiIcon.svg"

interface QuickStartModalProps {
  onClose: () => void
}
export default function QuickStartModal (props: QuickStartModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999999] outline-none focus:outline-none">
        <div className="relative mx-auto w-[550px]">
          <div className="border-0 rounded-xl overflow-hidden relative flex flex-col w-full outline-none focus:outline-none">
            <div onClick={()=>{props?.onClose()}} className="flex items-center justify-center px-6 pb-6 text-white font-semibold text-[48px]">
              Click here to start
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-[999999] bg-black"></div>
    </>
  );
}
