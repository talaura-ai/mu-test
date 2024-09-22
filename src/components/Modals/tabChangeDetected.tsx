import { ReactSVG } from "react-svg";
import TabChangeIcon from "../../assets/svg/RestoreWindow.svg";

interface TabChangeDetectionModalProps {
  onPress: (val: string) => void;
}
export default function TabChangeDetectionModal(
  props: TabChangeDetectionModalProps
) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative mx-auto sm:w-[550px] w-[90%]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center sm:py-10 py-2 bg-[#FFF6ED]">
                <ReactSVG src={TabChangeIcon} />
              </div>
              <p className="text-black leading-relaxed pt-6 px-6 font-sansation font-bold text-[18px] text-center">
                Suspicious activity detected
              </p>
              <p className="text-black leading-relaxed px-6 pt-2 pb-4 font-sansation font-medium text-[16px] text-center">
                You have moved away from the test window. Kindly refrain from
                switching tabs.
              </p>
            </div>
            <div className="flex items-center justify-center px-6 sm:pb-6 pb-3 sm:gap-4 gap-2 sm:mt-4 mt-2">
              <button
                onClick={() => {
                  props?.onPress("cancel");
                }}
                type="button"
                className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 sm:py-2 py-1 text-center inline-flex items-center justify-center"
              >
                Cancel
              </button>
              {/* <button onClick={ () => { props?.onPress("exit") } } type="button" className="text-white ml-2 bg-[#CC8448] font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center">
                Exit
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
