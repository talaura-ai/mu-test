import React from "react";
import { useNavigate } from "react-router-dom";
import CalenderIcon from "../../assets/svg/calenderIcon.svg"
import DurationIcon from "../../assets/svg/durationIcon.svg"
import ExpireIcon from "../../assets/svg/expireIcon.svg"
import DeviceConfigTestModal from "../../components/deviceConfigTestModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAssessmentDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import moment from "moment";
import { getExpiredIn } from "../../utils/helper";

function MyAssessments () {
  const navigate = useNavigate();
  const [deviceConfigModal, setDeviceConfigModal] = React.useState(false);
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const dispatcher = useAppDispatch()
  const myAssessments = useAppSelector(getAssessmentsSelector)
  console.log('myAssessments=>', myAssessments)

  const onNextClicked = () => {
    setDeviceConfigModal(false)
    navigate(`/assessment/${selectAssessment?._id}/share-details`);
  }

  React.useEffect(() => {
    dispatcher(setAssessmentDispatcher({ userId: "6654dfb48827c464882ef847" }))
  }, [dispatcher])

  return (
    <>
      { deviceConfigModal && <DeviceConfigTestModal onClose={ () => { setDeviceConfigModal(false) } } onNextClicked={ onNextClicked } /> }
      <div className="sm:p-6 md:px-20 md:py-7 p-4">
        <div className="flex items-center justify-between mb-6 mt-5">
          <div className="flex items-center justify-start">
            <span className="text-xl font-semibold font-sansation text-black self-center sm:text-2xl whitespace-nowrap">
              Assessments
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-[150px] text-gray-900 dark:text-gray-100">
              <div className="relative w-full group">
                <button className="py-2.5 px-3 w-full md:text-sm text-site bg-white border border-dimmed focus:border-brand focus:outline-none focus:ring-0 peer flex items-center justify-between rounded font-semibold font-sansation">Active</button>
                <div
                  className="absolute z-[99] top-[100%] left-[50%] translate-x-[-50%] rounded-md overflow-hidden shadow-lg min-w-[150px] opacity-0 invisible w-max peer-focus:visible peer-focus:opacity-100 duration-200 p-1 bg-gray-100 dark:bg-gray-800  border border-dimmed text-xs md:text-sm">
                  <div
                    className="font-sansation w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                    All</div>
                  <div
                    className="font-sansation w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                    Active
                  </div>
                  <div
                    className="font-sansation w-full block cursor-pointer hover:bg-white dark:hover:bg-gray-900 dark:bg-gray-800 hover:text-link px-3 py-2 rounded-md">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        { myAssessments?.map((item) => (
          <div key={ item } className="flex flex-wrap items-center justify-around mb-6 rounded-2xl bg-white relative">
            <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl absolute top-auto left-0 bottom-auto"></div>
            <div className="flex flex-col items-center justify-center py-6 md:w-[40%] sm:w-full">
              <span className="text-[36px] font-semibold text-[#F2BC84] self-center leading-[38px] font-sansation">
                A2
              </span>
              <span className="text-[18px] font-semibold text-[#BDBDBD] self-center leading-[20px] font-sansation">
                Sales Department
              </span>
            </div>
            <div className="flex items-center sm:justify-around md:justify-between md:w-[40%] sm:w-full px-2">
              <div className="flex flex-col justify-center">
                <img src={ CalenderIcon } className="h-[20px] w-[20px]" />
                <span className="text-[16px] font-medium text-[#5C7CFA] leading-[18px] font-sansation">
                  Started On
                </span>
                <span className="text-[16px] font-semibold text-black leading-[16px] font-sansation">
                  { moment(item?.startsAt).format("MMM DD, YYYY") }
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <img src={ DurationIcon } className="h-[20px] w-[20px]" />
                <span className="text-[16px] font-medium text-[#E9BF3E] leading-[18px] font-sansation">
                  Duration
                </span>
                <span className="text-[16px] font-semibold text-black leading-[16px] font-sansation">
                  120 minutes
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <img src={ ExpireIcon } className="h-[20px] w-[20px]" />
                <span className="text-[16px] font-medium text-[#7951E6] leading-[18px] font-sansation">
                  Expires In
                </span>
                <span className="text-[16px] font-semibold text-black leading-[16px] font-sansation">
                  { getExpiredIn(item?.startsAt, item?.endsOn) }
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center py-6 md:w-[20%] sm:w-full">
              <button type="button" onClick={ () => {
                setDeviceConfigModal(true)
                setSelectAssessment(item)
              } } className="text-white font-sansation bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40">
                Start
              </button>
            </div>
          </div>
        )) }
      </div>
    </>
  );
}
export default MyAssessments;
