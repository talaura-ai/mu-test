import MultiUserIcon from "../../assets/svg/multiUserIcon.svg";
import AiBot from "../../assets/AiBot.png";
import VideoCallUser from "../../assets/VideoCallUser.png";
import VoiceIcon from "../../assets/Group 171.png";
import MicIcon from "../../assets/svg/micIcon2.svg";
import { useNavigate } from "react-router-dom";

const VideoTest = () => {
  const navigate = useNavigate();
  const noOfUser = 3;
  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-6 border-b-2 border-[#7d7c78] pb-4 font-sansation">
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

      <div className="flex md:flex-row flex-col  md:justify-center gap-4">
        <div className="flex flex-col w-2/3 h-1/2 md:flex-row justify-between ">
          <div className="flex relative h-1/2 w-1/2 ">
            <img src={AiBot} className="px-2" alt="left icon" />
            <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
              Ai Bot
            </div>
            <div className="absolute right-6 bottom-4  text-white  px-4 py-1  ">
              <img src={MicIcon} className="h-8 w-10" alt="mic" />
            </div>
          </div>
          <div className="flex relative h-1/2 w-1/2 ">
            <div className="flex  rounded-lg ">
              <img src={VideoCallUser} className="px-2" alt="left icon" />
              <div className="absolute left-6 bottom-4 bg-black opacity-75 text-white font-semibold px-4 py-1 rounded font-sansation">
                Manisha
              </div>
              <div className="absolute right-6 bottom-4  text-white  px-4 py-1  ">
                <img src={MicIcon} className="h-8 w-10" alt="mic" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/3  bg-white shadow rounded-lg p-4">
          {/* <div className=" flex justify-center w-full">
            <img
              src={ LanguageIcon }
              className="px-2 bg-[#FFEFDF]"
              alt="left icon"
            />
          </div>
          <div className="flex ">
            <img src={ ChatIcon } className="px-2" alt="left icon" />
          </div> */}
          <div className="flex h-[480px] w-full flex-col">
            <div className="flex gap-2">
              <img src={VoiceIcon} alt="icn" />
              <span className="text-xs text-gray-300 mt-2">CC/Subtitle </span>
            </div>
            <div className="flex mx-10 bg-white ">
              <span>
                Hi how are you doing?
                <br />
                Im doing well how about you?
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center py-6 font-sansation">
        <img src={ Caption } alt="caption" />
      </div> */}
      <div className="flex justify-center py-6 font-sansation">
        <button
          className="flex justify-center bg-[#E04747] px-3 py-2 rounded-lg text-white font-semibold"
          onClick={() => navigate("/")}
        >
          End Meet
        </button>
      </div>
    </div>
  );
};

export default VideoTest;
