import { useNavigate } from "react-router-dom";
import TimeLeftIcon from "../../assets/svg/timeLeftIcon.svg"

function StartMCQTest () {
  const navigate = useNavigate();
  return (
    <>
      <div className="sm:p-6 md:p-12 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-start">
            <span className="font-bold text-black self-center sm:text-3xl whitespace-nowrap text-[40px] ">
              Module 1: MCQ Test
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-full flex">
              <p className="text-[18px] text-[#FB2121] font-semibold">Time left</p>
              <img src={ TimeLeftIcon } className="px-2" />
              <p className="text-[18px] text-[#FB2121] font-semibold">20:39 min</p>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-6 px-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div className="bg-gradient-to-r from-[#E5A971] to-[#F3BC84] h-2.5 rounded-full w-1/2" ></div>
          </div>
        </div>
        <div className="flex items-center mb-6 bg-green-500">

        </div>
      </div>
    </>
  );
}

export default StartMCQTest;


