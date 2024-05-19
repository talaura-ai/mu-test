import { useNavigate } from "react-router-dom";
import TimeLeftIcon from "../../assets/svg/timeLeftIcon.svg";
import UserIcon from "../../assets/svg/userIcon.svg";
import QuestionNumberBox from "../../components/questionNumberBox";

function StartMCQTest() {
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
              <p className="text-[18px] text-[#FB2121] font-semibold">
                Time left
              </p>
              <img src={TimeLeftIcon} className="px-2" />
              <p className="text-[18px] text-[#FB2121] font-semibold">
                20:39 min
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-6 px-4">
          <div className="w-full bg-[#C7C6C0] rounded-full h-2.5 mb-4 dark:bg-gray-700 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
            <div
              className="bg-gradient-to-r from-[#E5A971] to-[#F3BC84] h-2.5 rounded-full"
              style={{ width: `${50}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-6 flex md:flex-row flex-col">
          <div className="basis-[35%] w-full">
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <div className="flex flex-row items-center mx-6 py-4 border-solid border-b-[3px] border-[#E6E6E6]">
                <img
                  className="w-24 h-24 rounded-full shadow-lg"
                  src={UserIcon}
                  alt="user image"
                />
                <h5 className="text-[24px] font-medium text-black ml-5">
                  Bonnie Green
                </h5>
              </div>
              <div className="flex flex-col mx-8 py-4">
                <h5 className="text-[18px] font-normal text-black">
                  Question analysis
                </h5>
                <div className=" flex w-full items-center space-x-2 mt-2">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#F3BC84]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Question analysis
                  </h5>
                  <div className="w-[2px] min-h-[14px] bg-[#B1B1B1]"></div>
                  <div className="w-[12px] h-[12px] rounded-full border-[#B1B1B1] border-solid border-[2px]"></div>
                  <h5 className="text-[10px] font-normal text-[#B1B1B1]">
                    Question analysis
                  </h5>
                </div>
                <div className=" flex flex-wrap w-full gap-5 my-5">
                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                  ].map((index) => (
                    <QuestionNumberBox
                      questionNo={index}
                      checked={index % 2 === 0}
                      key={index}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                className=" flex w-full text-white bg-[#CC8448] tracking-wide font-medium text-md px-12 py-2.5 text-center justify-center items-center"
              >
                Submit Test
              </button>
            </div>
          </div>
          <div className="basis-[65%] h-8 bg-red-100">02</div>
        </div>
      </div>
    </>
  );
}

export default StartMCQTest;
