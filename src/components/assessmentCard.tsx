import { useLocation, useParams } from "react-router-dom";
import CalenderIcon from "../assets/svg/calenderIcon.svg"
import DurationIcon from "../assets/svg/durationIcon.svg"
import ExpireIcon from "../assets/svg/expireIcon.svg"
import React from "react";
import { useAppSelector } from "../store/hooks";
import { getAssessmentsSelector } from "../store/slices/dashboard-slice/dashboard-selectors";
import { getExpiredIn } from "../utils/helper";
import moment from "moment";

function AssessmentCard () {
  const { assessmentId } = useParams();
  let location = useLocation();
  const myAssessments = useAppSelector(getAssessmentsSelector)
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(v => v?._id === assessmentId)
      setSelectAssessment(data?.[0])
    } else {
      setSelectAssessment({})
    }
  }, [location, myAssessments, assessmentId])

  return (
    <>
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
              { moment(selectAssessment?.startsAt).format("MMM DD, YYYY") }
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
              { getExpiredIn(selectAssessment?.startsAt, selectAssessment?.endsOn) }
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssessmentCard;
