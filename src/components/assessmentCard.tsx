import { useLocation, useParams } from "react-router-dom";
import CalenderIcon from "../assets/svg/calenderIcon.svg";
import DurationIcon from "../assets/svg/durationIcon.svg";
import ExpireIcon from "../assets/svg/expireIcon.svg";
import React from "react";
import { useAppSelector } from "../store/hooks";
import { getAssessmentsSelector } from "../store/slices/dashboard-slice/dashboard-selectors";
import { assessmentTotalTime, getExpiredIn } from "../utils/helper";
import moment from "moment";
import CountdownTimer from "./countdownTimer";
import { ReactSVG } from "react-svg";

function AssessmentCard({ onExpired }: any) {
  const { assessmentId } = useParams();
  let location = useLocation();
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(
        (v) => v?.assessmentId === assessmentId
      );
      setSelectAssessment(data?.[0]);
    } else {
      setSelectAssessment({});
    }
  }, [location, myAssessments, assessmentId]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:mb-12 mb-6 ">
        <div className="flex md:flex-row flex-col items-center justify-around md:justify-between md:w-[55%]  w-full bg-white rounded-lg shadow-lg sm:px-10 px-6   py-6">
          <div className="flex justify-center flex-col items-start sm:w-[40%] w-[100%]">
            <span className="sm:text-[36px] text-[26px] sm:text-left text-center font-semibold text-[#F2BC84] self-center sm:leading-[38px] leading-[30px] font-sansation">
              {selectAssessment?.assessmentName || ""}
            </span>
            {/* <span className="text-[18px] font-semibold text-black self-center leading-[20px] font-sansation">
              Sales Department
            </span> */}
          </div>
          <div className="flex justify-between sm:mt-0 mt-4 sm:w-[60%] w-[100%]">
            <div className="flex flex-col justify-center mb-4">
              <ReactSVG src={CalenderIcon} className="h-[20px] w-[20px]" />
              <span className="sm:text-[16px] text-[10px] font-medium text-[#5C7CFA] leading-[18px] font-sansation mt-1.5">
                Started On
              </span>
              <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                {moment(selectAssessment?.startsAt).format("MMM DD, YYYY")}
              </span>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <ReactSVG src={DurationIcon} className="h-[20px] w-[20px]" />
              <span className="sm:text-[16px] text-[10px] font-medium text-[#E9BF3E] leading-[18px] font-sansation mt-2">
                Duration
              </span>
              <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                {assessmentTotalTime(selectAssessment?.module)} minutes
              </span>
            </div>
            <div className="flex flex-col justify-center mb-4">
              <ReactSVG src={ExpireIcon} className="h-[20px] w-[20px]" />
              <span className="sm:text-[16px] text-[10px] font-medium text-[#7951E6] leading-[18px] font-sansation mt-2">
                Expires In
              </span>
              <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                {/* { getExpiredIn(selectAssessment?.startsAt, selectAssessment?.endsOn) } */}
                <CountdownTimer
                  onTimeout={() => {
                    onExpired();
                  }}
                  timestamp={moment(selectAssessment?.endsOn).diff(
                    moment(),
                    "minutes"
                  )}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssessmentCard;
