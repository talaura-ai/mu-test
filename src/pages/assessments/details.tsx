import React from "react";
import { useNavigate } from "react-router-dom";
import UnlockNextIcon from "../../assets/svg/unlockNext.svg";
import LockNextIcon from "../../assets/svg/lockIcon.svg";
import StartTestConfirmationModal from "../../components/startTestConfirmationModal";
import CalenderIcon from "../../assets/svg/calenderIcon.svg"
import DurationIcon from "../../assets/svg/durationIcon.svg"
import ExpireIcon from "../../assets/svg/expireIcon.svg"

function AssessmentDetails () {
  const navigate = useNavigate();
  const [startTestModal, setStartTestModal] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState(0);

  const onNextClicked = () => {
    setStartTestModal(false);
    if (selectedTest % 2 !== 0) {
      navigate("/assessment/1/1");
    } else {
      navigate("/assessment/1/coding");
    }
  };

  return (
    <>
      <div className="sm:p-8 md:p-16 p-4">
        <div className="flex flex-wrap items-center justify-center md:mb-12 mb-6">
          <div className="flex md:flex-row flex-col items-center justify-around md:justify-between md:w-[50%] w-full px-4">
            <div className="flex flex-col justify-center mb-4">
              <span className="text-[36px] font-semibold text-[#F2BC84] self-center leading-[38px]">
                A2
              </span>
              <span className="text-[18px] font-semibold text-black self-center leading-[20px]">
                Sales Department
              </span>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <img src={ CalenderIcon } className="h-[20px] w-[20px]" />
              <span className="text-[16px] font-medium text-[#5C7CFA] leading-[18px]">
                Started On
              </span>
              <span className="text-[16px] font-semibold text-black leading-[16px]">
                Apr 28, 2024
              </span>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <img src={ DurationIcon } className="h-[20px] w-[20px]" />
              <span className="text-[16px] font-medium text-[#E9BF3E] leading-[18px]">
                Duration
              </span>
              <span className="text-[16px] font-semibold text-black leading-[16px]">
                120 minutes
              </span>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <img src={ ExpireIcon } className="h-[20px] w-[20px]" />
              <span className="text-[16px] font-medium text-[#7951E6] leading-[18px]">
                Expires In
              </span>
              <span className="text-[16px] font-semibold text-black leading-[16px]">
                1D:22H:30M
              </span>
            </div>
          </div>
        </div>

        { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={ item }
            className="flex flex-wrap justify-around mb-10 rounded-2xl relative py-3 bg-white"
          >
            <div className="absolute top-0 left-0 bottom-auto h-full flex items-center">
              <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl"></div>
            </div>
            <div className="absolute -top-6 -left-4">
              { item % 2 !== 0 ? (
                <img src={ UnlockNextIcon } />
              ) : (
                <img src={ LockNextIcon } />
              ) }
            </div>
            <div className="flex flex-col items-center justify-center py-4 md:w-[25%] sm:w-full px-4">
              <span className="text-[22px] font-semibold text-[#F2BC84] self-center">
                { item % 2 !== 0
                  ? "Module 1: MCQ Test"
                  : "Module 2: Coding" }
              </span>
            </div>
            <div className="flex flex-col md:w-[25%] sm:w-full px-4">
              <span className="text-[20px] font-normal text-black">Skills</span>
              <span className="text-[14px] font-medium text-[#BDBDBD]">
                Objective-C/Swift Proficiency, Offline Storage & Threading,
                Performance Tuning, RESTful APIs Integration, Cloud Messaging.
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
              <button
                type="button"
                onClick={ () => {
                  setStartTestModal(true);
                  setSelectedTest(item);
                } }
                className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40"
              >
                Next
              </button>
            </div>
          </div>
        )) }
      </div>
      { startTestModal && (
        <StartTestConfirmationModal
          onClose={ () => {
            setStartTestModal(false);
          } }
          onNextClicked={ onNextClicked }
        />
      ) }
    </>
  );
}

export default AssessmentDetails;
