import { ReactSVG } from "react-svg";
import SubmitIcon from "../../assets/svg/submitIcon.svg";

interface ModuleConfirmationModalProps {
  onPress: (val: string) => void;
  title?: string;
}
export default function ModuleConfirmationModal(
  props: ModuleConfirmationModalProps
) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative mx-auto sm:w-[450px] w-[90%]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center py-8 bg-[#FFF6ED]">
                <ReactSVG src={SubmitIcon} />
                {props?.title ? (
                  <p className="text-[#CC8448] text-[22px] font-sansation font-semibold mt-4">
                    {props?.title}
                  </p>
                ) : null}
              </div>
              <p className="text-black leading-relaxed py-4 px-6 font-sansation font-bold text-[18px] text-center">
                Are you sure, you want to submit Test?
              </p>
            </div>
            <div className="flex items-center justify-between px-6 pb-6 gap-4 mt-4">
              <button
                onClick={() => {
                  props?.onPress("cancel");
                }}
                type="button"
                className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  props?.onPress("submit");
                }}
                type="button"
                className="text-white ml-2 bg-[#CC8448] font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
