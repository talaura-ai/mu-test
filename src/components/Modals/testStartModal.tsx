import { AiOutlineInfoCircle } from "react-icons/ai";

interface ModuletestStartModalProps {
  onPress: (val: string) => void;
}
export default function ModuletestStartModal (props: ModuletestStartModalProps) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[450px]">
          <div className="border-0 rounded-3xl shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto justify-center flex-col items-center">
              <div className="flex justify-center items-center py-8">
                <AiOutlineInfoCircle size={ 96 } color={ "#CC8448" } />
              </div>
              <p className="text-blueGray-500 leading-relaxed py-4 font-sansation font-bold text-[18px] text-center">
                let's start the test
              </p>
            </div>
            <div className="flex items-center justify-between px-6 pb-6 gap-4">
              <button
                onClick={ () => {
                  props?.onPress("cancel");
                } }
                type="button"
                className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={ () => {
                  props?.onPress("start");
                } }
                type="button"
                className="text-white ml-2 bg-[#CC8448] font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center"
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
