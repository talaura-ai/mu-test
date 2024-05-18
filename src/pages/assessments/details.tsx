import { useNavigate } from "react-router-dom";
import UnlockNextIcon from "../../assets/svg/unlockNext.svg"
import LockNextIcon from "../../assets/svg/lockIcon.svg"

function AssessmentDetails () {
  const navigate = useNavigate();
  return (
    <>
      <div className="sm:p-6 md:p-12 p-4">
        { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div key={ item } className="flex flex-wrap justify-around mb-8 rounded-2xl relative py-4 bg-white">
            <div className="absolute top-0 left-0 bottom-auto h-full flex items-center">
              <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl"></div>
            </div>
            <div className="absolute -top-6 -left-6">
              { item % 2 !== 0 ? <img src={ UnlockNextIcon } /> :
                <img src={ LockNextIcon } /> }
            </div>
            <div className="flex flex-col items-center justify-center py-4 md:w-[25%] sm:w-full px-4">
              <span className="text-[22px] font-semibold text-[#F2BC84] self-center">
                Module 1: Code Sandbox
              </span>
            </div>
            <div className="flex flex-col md:w-[25%] sm:w-full px-4">
              <span className="text-[20px] font-normal text-black">
                Skills
              </span>
              <span className="text-[16px] font-medium text-[#BDBDBD]">
                Objective-C/Swift Proficiency, Offline Storage & Threading, Performance Tuning, RESTful APIs Integration, Cloud Messaging.
              </span>
            </div>
            <div className="flex sm:justify-around md:justify-between md:w-[35%] sm:w-full px-2">
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black">
                  Questions
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD]">
                  5
                </span>
              </div>
              <div className="flex flex-col text-center items-center">
                <span className="text-[20px] font-normal text-black">
                  Weightage
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] min-w-[50px] border-b border-[#E5A971]">
                  25%
                </span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black">
                  Duration
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD]">
                  120 min
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center py-6 md:w-[15%] sm:w-full">
              <button type="button" onClick={ () => { navigate("/assessment/1"); } } className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40">
                Next
              </button>
            </div>
          </div>
        )) }
      </div>
    </>
  );
}

export default AssessmentDetails;


