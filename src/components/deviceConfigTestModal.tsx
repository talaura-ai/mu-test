import CloseIcon from "../assets/svg/closeIcon.svg"
import CheckedIcon from "../assets/svg/checkedIcon.svg"
import WifiIcon from "../assets/svg/wifiIcon.svg"
import CameraIcon from "../assets/svg/cameraIcon.svg"
import MicIcon from "../assets/svg/micIcon.svg"

export default function DeviceConfigTestModal (props: any) {
  const data = [
    { name: "Mic", icon: MicIcon },
    { name: "Camera", icon: CameraIcon },
    { name: "Internet", icon: WifiIcon }
  ]
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-full my-6 mx-auto max-w-lg">
          {/*content*/ }
          <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-[#F9F7F0] outline-none focus:outline-none px-6">
            {/*header*/ }
            <div className="relative flex items-center py-3 justify-center border-solid border-b-2 border-[#BDBDBD] rounded-t">
              <h3 className="text-[24px] text-[#F2BC84] font-semibold">
                Device Config Test
              </h3>
              <button
                className="absolute border-0 text-3xl leading-none font-semibold outline-none top-0 right-0 bottom-0"
                onClick={ () => { props?.onClose() } }
              >
                <img src={ CloseIcon } />
              </button>
            </div>
            {/*body*/ }
            <div className="py-8 px-3 flex-auto">
              { data.map((item) => (
                <div key={ item?.name } className="flex flex-wrap items-center justify-between mb-8 rounded-2xl bg-white relative px-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
                  <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl absolute top-auto left-0 bottom-auto"></div>
                  <div className="flex items-center justify-center py-6 pl-2 gap-4">
                    <img src={ item?.icon } />
                    <span className="text-[24px] font-medium text-black self-center leading-[38px]">
                      { item?.name }
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-6">
                    <img src={ CheckedIcon } />
                  </div>
                </div>
              )) }
            </div>
            {/*footer*/ }
            <div className="flex items-center justify-center p-6">
              <button onClick={ () => { props?.onNextClicked() } } type="button" className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40">
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