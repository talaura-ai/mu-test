import CalenderIcon from "../../assets/svg/calenderIcon.svg"
import DurationIcon from "../../assets/svg/durationIcon.svg"
import ExpireIcon from "../../assets/svg/expireIcon.svg"

function MyAssessments () {

  return (
    <>
      <div id="middle-section" className="mt-16 rounded-tl-xl bg-[#F9F7F0] overflow-y-scroll shadow-[inset_5px_5px_10px_#e1e1e1]">
        <div className="sm:p-6 md:p-12 p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-start">
              <span className="text-xl font-semibold text-black self-center sm:text-2xl whitespace-nowrap">
                Assessments
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-[150px] text-gray-900 dark:text-gray-100">
                <div className="relative w-full group">
                  <button className="py-2.5 px-3 w-full md:text-sm text-site bg-white border border-dimmed focus:border-brand focus:outline-none focus:ring-0 peer flex items-center justify-between rounded font-semibold">Active</button>
                  <div
                    className="absolute z-[99] top-[100%] left-[50%] translate-x-[-50%] rounded-md overflow-hidden shadow-lg min-w-[150px] w-max peer-focus:visible peer-focus:opacity-100 opacity-0 invisible duration-200 p-1 bg-gray-100 dark:bg-gray-800  border border-dimmed text-xs md:text-sm">
                    <div
                      className=" w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                      All</div>
                    <div
                      className=" w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                      Active
                    </div>
                    <div
                      className=" w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div key={ item } className="flex flex-wrap items-center justify-around mb-6 rounded-2xl bg-white relative">
              <div className="w-[12px] md:h-[84px] sm:h-[150px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl absolute top-auto left-0 bottom-auto"></div>
              <div className="flex flex-col items-center justify-center py-6 md:w-[40%] sm:w-full">
                <span className="text-[36px] font-semibold text-[#F2BC84] self-center leading-[38px]">
                  A2
                </span>
                <span className="text-[18px] font-semibold text-[#BDBDBD] self-center leading-[20px]">
                  Sales Department
                </span>
              </div>
              <div className="flex items-center sm:justify-around md:justify-between md:w-[40%] sm:w-full px-2">
                <div className="flex flex-col justify-center">
                  <img src={ CalenderIcon } className="h-[20px] w-[20px]" />
                  <span className="text-[16px] font-medium text-[#5C7CFA] leading-[18px]">
                    Started On
                  </span>
                  <span className="text-[16px] font-semibold text-black leading-[16px]">
                    Apr 28, 2024
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <img src={ DurationIcon } className="h-[20px] w-[20px]" />
                  <span className="text-[16px] font-medium text-[#E9BF3E] leading-[18px]">
                    Duration
                  </span>
                  <span className="text-[16px] font-semibold text-black leading-[16px]">
                    120 minutes
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <img src={ ExpireIcon } className="h-[20px] w-[20px]" />
                  <span className="text-[16px] font-medium text-[#7951E6] leading-[18px]">
                    Expires In
                  </span>
                  <span className="text-[16px] font-semibold text-black leading-[16px]">
                    1D:22H:30M
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center py-6 md:w-[20%] sm:w-full">
                <button type="button" className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40">
                  Start
                </button>
              </div>
            </div>
          )) }
        </div>
      </div>
    </>
  );
}

export default MyAssessments;


