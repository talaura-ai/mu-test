import TabChangeIcon from "../../assets/svg/RestoreWindow.svg"

interface TabChangeDetectionModalProps {
  onPress: (val: string) => void
}
export default function TabChangeDetectionModal (props: TabChangeDetectionModalProps) {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative mx-auto w-[550px]">
          <div className="border-0 rounded-xl overflow-hidden shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative flex-auto justify-center flex-col items-center">
              <div className="flex flex-col justify-center items-center py-10 bg-[#FFF6ED]">
                <img src={ TabChangeIcon } />
              </div>
              <p className="text-black leading-relaxed pt-6 px-6 font-sansation font-bold text-[18px] text-center">
                A tab switch has been detected.
              </p>
              <p className="text-black leading-relaxed px-6 pt-2 pb-4 font-sansation font-medium text-[16px] text-center">
                If a tab switch is detected, your exam will be automatically submitted.
              </p>
            </div>
            <div className="flex items-center justify-center px-6 pb-6 gap-4 mt-4">
              <button onClick={ () => { props?.onPress("cancel") } } type="button" className="text-black border-black border-[1px] mr-2 font-medium font-sansation rounded-md text-lg w-40 py-2 text-center inline-flex items-center justify-center">
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
