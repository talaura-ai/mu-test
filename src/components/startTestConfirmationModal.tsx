import GrayCloseIcon from "../assets/svg/closeIconGray.svg"

export default function StartTestConfirmationModal (props: any) {
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none font-sansation"
      >
        <div className="relative w-full my-6 mx-auto max-w-xl">
          {/*content*/ }
          <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden">
            {/*header*/ }
            <div className="relative flex items-center py-3 justify-center border-solid border-t-8 border-[#FFAC3A]">
              <h3 className="text-[24px] text-black font-semibold">
                Application of Aptitude Test - 72
              </h3>
              <button
                className="absolute border-0 text-3xl leading-none font-semibold outline-none top-0 right-6 bottom-0"
                onClick={ () => { props?.onClose() } }
              >
                <img src={ GrayCloseIcon } />
              </button>
            </div>
            {/*body*/ }
            <div className="px-3 flex-auto">
              <div className="flex flex-col px-6 py-4">
                <span className="text-[20px] font-semibold text-[#7A8A94]">
                  Duration: <span className=" text-black text-[20px] font-medium">10 Mins</span>
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  Maximum Marks: <span className=" text-black text-[20px] font-medium">10</span>
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  Read the following instructionscarefully.
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  1. <span className=" text-black text-[20px] font-medium">The test contains </span>10 total questions.
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  2. <span className=" text-black text-[20px] font-medium">Each question has </span>4 options <span className=" text-black text-[20px] font-medium">out of which </span>only one is
                  correct.
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  3. <span className=" text-black text-[20px] font-medium">You have to finish the test in </span>10 minutes.
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  4. <span className=" text-black text-[20px] font-medium">You will be awarded  </span>1 mark <span className=" text-black text-[20px] font-medium">for each correct answer.</span>
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  5. <span className=" text-black text-[20px] font-medium">You can view your </span>Score & Rank <span className=" text-black text-[20px] font-medium">after submitting the test.</span>
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  6. <span className=" text-black text-[20px] font-medium">Check </span>detailed Solution <span className=" text-black text-[20px] font-medium">with explanation after submitting
                    the test.</span>
                </span>
                <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
                  7. <span className=" text-black text-[20px] font-medium">Rank is calculated on the basis of </span>Marks Scored & Time
                </span>
              </div>

            </div>
            {/*footer*/ }
            <div className="flex items-center justify-center border-t-[#CCC] border-t border-solid py-4">
              <button onClick={ () => { props?.onClose() } } type="button" className="text-[#7A8A94] border-[#CCC] border mr-2 font-medium rounded-md text-lg w-40 py-2.5 text-center inline-flex items-center justify-center">
                Cancel
              </button>
              <button onClick={ () => { props?.onNextClicked() } } type="button" className="text-white ml-2 bg-[#CC8448] font-medium rounded-md text-lg w-40 py-2.5 text-center inline-flex items-center justify-center">
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}