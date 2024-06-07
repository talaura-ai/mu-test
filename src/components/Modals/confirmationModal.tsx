import { AiOutlineInfoCircle } from "react-icons/ai";

interface ModuleConfirmationModalProps {
  onPress: (val: string) => void
}
export default function ModuleConfirmationModal (props: ModuleConfirmationModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[350px]">
          <div className="border-0 rounded-3xl shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto justify-center flex-col items-center">
              <div className="flex justify-center items-center py-4">
                <AiOutlineInfoCircle size={ 96 } color={ "#CC8448" } />
              </div>
              <p className="text-blueGray-500 leading-relaxed py-4 font-nunito font-bold text-[18px] text-center">
                Are you sure, You want to submit the test?
              </p>
            </div>
            <div className="flex items-center justify-between px-6 pb-6 gap-4">
              <button onClick={ () => { props?.onPress("submit") } } type="button" className="text-white ml-2 bg-[#CC8448] font-medium rounded-md text-lg w-40 py-2.5 text-center inline-flex items-center justify-center">
                Submit Test
              </button>
              <button onClick={ () => { props?.onPress("cancel") } } type="button" className="text-[#7A8A94] border-[#CCC] border mr-2 font-medium rounded-md text-lg w-40 py-2.5 text-center inline-flex items-center justify-center">
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
