import React from "react";
import MultiUserIcon from "../../assets/svg/multiUserIcon.svg";
const VideoTest = () => {
  const noOfUser = 3;
  return (
    <div className="sm:p-6 md:p-12 p-4">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-6 border-b-2 border-[#7d7c78] pb-4">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            Module 2: Video Round
          </span>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="w-full flex items-center">
            <p className="text-[18px] text-black font-normal mr-10">3:24:45</p>
            <img src={MultiUserIcon} className="px-2" alt="left icon" />
            <span className="text-[24px] font-semibold text-[#a7a6a0]">
              {noOfUser}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTest;
