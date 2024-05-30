import { useNavigate } from "react-router-dom";
import CalenderIcon from "../../assets/svg/calenderIcon.svg"
import DurationIcon from "../../assets/svg/durationIcon.svg"
import ExpireIcon from "../../assets/svg/expireIcon.svg"

function PersonNeedMoreInfo () {
  const navigate = useNavigate();

  const onSaveClicked = () => {
    navigate("/assessment/1");
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

        <div
          className="flex flex-col mb-10 rounded-2xl bg-white p-8 shadow-lg"
        >
          <span className="text-[22px] font-semibold text-black">
            Enter your Details
          </span>
          <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-4 pt-4">
            <div className="flex flex-col h-24">
              <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C]">Name<span className="text-[#FB2121]">*</span></label>
              <input type="text" id="error" className="bg-[#F2F1F1] border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5" placeholder="Enter Name" />
              <p className="mt-1 text-sm text-[#FB2121]">Required</p>
            </div>
            <div className="flex flex-col h-24">
              <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C]">Name<span className="text-[#FB2121]">*</span></label>
              <input type="text" id="error" className="bg-[#F2F1F1] border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5" placeholder="Enter Name" />
              <p className="mt-1 text-sm text-[#FB2121]">Required</p>
            </div>
            <div className="flex flex-col h-24">
              <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C]">Name<span className="text-[#FB2121]">*</span></label>
              <input type="text" id="error" className="bg-[#F2F1F1] border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5" placeholder="Enter Name" />
              <p className="mt-1 text-sm text-[#FB2121]">Required</p>
            </div>
            <div className="flex flex-col h-24">
              <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C]">Name<span className="text-[#FB2121]">*</span></label>
              <input type="text" id="error" className="bg-[#F2F1F1] border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5" placeholder="Enter Name" />
              <p className="mt-1 text-sm text-[#FB2121]">Required</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-12">
          <button
            type="button"
            onClick={ () => {
              onSaveClicked()
            } }
            className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default PersonNeedMoreInfo;
