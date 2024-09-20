import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CalenderIcon from "../../assets/svg/calenderIcon.svg";
import DurationIcon from "../../assets/svg/durationIcon.svg";
import ExpireIcon from "../../assets/svg/expireIcon.svg";
import DeviceConfigTestModal from "../../components/deviceConfigTestModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAssessmentDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import moment from "moment";
import { assessmentTotalTime, getExpiredIn } from "../../utils/helper";
import CountdownTimer from "../../components/countdownTimer";
import ModuleExpiredModal from "../../components/Modals/moduleExpired";
import { ReactSVG } from "react-svg";

function MyAssessments() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [deviceConfigModal, setDeviceConfigModal] = React.useState(false);
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const [assessmentExpired, setAssessmentExpired] = React.useState<any>({});
  const [isModuleExpired, setIsModuleExpired] = React.useState<boolean>(false);
  const dispatcher = useAppDispatch();
  const myAssessments = useAppSelector(getAssessmentsSelector);

  const onNextClicked = () => {
    setDeviceConfigModal(false);
    if (
      selectAssessment &&
      selectAssessment?.question &&
      selectAssessment?.question?.[0]
    ) {
      navigate(
        `/assessment/${userId}/${selectAssessment?.assessmentId}/share-details`
      );
    } else {
      navigate(
        `/assessment/${userId}/${selectAssessment?.assessmentId}/modules`
      );
    }
  };

  React.useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }));
    }
  }, [dispatcher, userId]);

  // //Disable Right click
  // if (document.addEventListener) {
  //   document.addEventListener(
  //     "contextmenu",
  //     function (e) {
  //       e.preventDefault();
  //     },
  //     false
  //   );
  // }

  const getAssessmentStatus = (modules: any) => {
    let flag = true;
    if (modules && modules?.length) {
      modules?.map((v: any) => {
        if (v?.status !== "Completed") {
          flag = false;
        }
      });
    }
    return flag;
  };
  const onExpired = (id: any) => {
    let expire = { ...assessmentExpired };
    expire[id] = "true";
    setAssessmentExpired(expire);
  };

  const currentTime = moment().valueOf();
  const startTime = myAssessments?.[0]?.startsAt;
  const isDisabled = currentTime < startTime;

  const getStatus = (item: any) => {
    const flag = getAssessmentStatus(item?.module);
    if (flag) {
      return "Completed";
    } else {
      const currentTime = moment().valueOf();
      const endsOn = item?.endsOn;
      const startTime = item?.startsAt;
      if (startTime < currentTime && currentTime < endsOn) {
        return "Start";
      } else {
        if (endsOn < currentTime) {
          return "Expired";
        } else {
          return "Start";
        }
      }
    }
  };
  const onStartModule = (item: any) => {
    const currentTime = moment().valueOf();
    const endsOn = item?.endsOn;
    const startTime = item?.startsAt;
    if (startTime < currentTime && currentTime < endsOn) {
      setDeviceConfigModal(true);
      setSelectAssessment(item);
    } else {
      if (endsOn < currentTime) {
        dispatcher(setAssessmentDispatcher({ userId }));
        setIsModuleExpired(true);
      }
    }
  };
  return (
    <>
      {deviceConfigModal && (
        <DeviceConfigTestModal
          onClose={() => {
            setDeviceConfigModal(false);
          }}
          onNextClicked={onNextClicked}
        />
      )}
      <div className="sm:p-6 md:px-20 md:py-7 p-4">
        <div className="flex items-center justify-between mb-6 mt-5">
          <div className="flex items-center justify-start">
            <span className="text-xl font-semibold font-sansation text-black self-center sm:text-2xl whitespace-nowrap">
              Assessments
            </span>
          </div>
          <div className="sm:flex hidden items-center">
            <div className="w-[150px] text-gray-900">
              <div className="relative w-full group">
                <button className="py-2.5 px-3 w-full md:text-sm text-site bg-white border border-dimmed focus:border-brand focus:outline-none focus:ring-0 peer flex items-center justify-between rounded font-semibold font-sansation">
                  Active
                </button>
                <div className="absolute z-[99] top-[100%] left-[50%] translate-x-[-50%] rounded-md overflow-hidden shadow-lg min-w-[150px] opacity-0 invisible w-max peer-focus:visible peer-focus:opacity-100 duration-200 p-1 bg-gray-100 border border-dimmed text-xs md:text-sm">
                  <div className="font-sansation w-full block cursor-pointer hover:bg-white hover:text-link px-3 py-2 rounded-md">
                    All
                  </div>
                  <div className="font-sansation w-full block cursor-pointer hover:bg-white hover:text-link px-3 py-2 rounded-md">
                    Active
                  </div>
                  <div className="font-sansation w-full block cursor-pointer hover:bg-white hover:text-link px-3 py-2 rounded-md">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {myAssessments?.map((item, index) => (
          <div
            key={item?.assessmentId + index}
            className="flex flex-wrap items-center justify-around mb-6 rounded-2xl bg-white relative shadow-lg sm:pb-0 pb-6"
          >
            <div className="sm:w-[10px] w-[7px] h-[70%] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl absolute sm:top-auto top-[15%] left-0 bottom-auto"></div>
            <div className="flex sm:flex-col flex-row items-center justify-between sm:py-6 py-0 md:w-[40%] sm:w-full w-[90%]">
              <span className="sm:text-[36px] text-[14px] font-semibold text-[#F2BC84] self-center justify-center pr-4 sm:pl-7 pl-0 sm:leading-[38px] leading-[20px] font-sansation">
                {item?.assessmentName || ""}
              </span>
              {/* <span className="text-[18px] font-semibold text-[#BDBDBD] self-center leading-[20px] font-sansation">
                Sales Department
              </span> */}
              <div className="sm:hidden flex items-center justify-center py-6 md:w-[20%] sm:w-full">
                {/* <button
                type="button"
                // disabled={
                //   isDisabled ||
                //   getAssessmentStatus(item?.module) ||
                //   assessmentExpired[item?.assessmentId]
                // }
                onClick={() => {
                  setDeviceConfigModal(true);
                  setSelectAssessment(item);
                }}
                className={`text-white font-sansation bg-[#CC8448] hover:bg-[#CC8448]/80 ${
                  getAssessmentStatus(item?.module)
                    ? "bg-[#CC8448]/80 cursor-not-allowed px-6"
                    : "px-12"
                } ${
                  assessmentExpired[item?.assessmentId]
                    ? "bg-[#CC8448]/80 cursor-not-allowed px-12"
                    : ""
                } focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md py-2.5 text-center inline-flex items-center`}
              >
                {getAssessmentStatus(item?.module) ? "Completed" : "Start"}
              </button> */}
                <button
                  type="button"
                  disabled={
                    isDisabled ||
                    getAssessmentStatus(item?.module) ||
                    assessmentExpired[item?.assessmentId]
                  } // Enable the disabled attribute
                  onClick={() => {
                    onStartModule(item);
                  }}
                  className={`text-white font-sansation bg-[#CC8448] text-[14px]
                    ${isDisabled ? "cursor-not-allowed bg-[#CC8448]/60" : ""}
                    ${
                      getAssessmentStatus(item?.module)
                        ? "px-2 cursor-not-allowed bg-[#CC8448]/60"
                        : "px-6"
                    }
   ${assessmentExpired[item?.assessmentId] ? "px-12" : ""}
        focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md py-1.5 text-center inline-flex items-center`}
                >
                  {getStatus(item)}
                </button>
              </div>
            </div>
            <div className="flex items-center sm:justify-around md:justify-between md:w-[40%] sm:w-full w-[90%] justify-between px-2">
              <div className="flex flex-col justify-center">
                <ReactSVG
                  src={CalenderIcon}
                  className="h-[20px] w-[20px]"
                  // beforeInjection={(svg) => {
                  //   svg.setAttribute("width", "50px");
                  //   svg.setAttribute("height", "50px");
                  // }}
                />
                <span className="sm:text-[16px] text-[10px] font-medium text-[#5C7CFA] leading-[18px] font-sansation mt-1.5">
                  Started On
                </span>
                <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                  {moment(item?.startsAt).format("MMM DD, YYYY, hh:mm A")}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <ReactSVG src={DurationIcon} className="h-[20px] w-[20px]" />
                <span className="sm:text-[16px] text-[10px] font-medium text-[#E9BF3E] leading-[18px] font-sansation mt-2">
                  Duration
                </span>
                <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                  {assessmentTotalTime(item?.module)} minutes
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <ReactSVG src={ExpireIcon} className="h-[20px] w-[20px]" />
                <span className="sm:text-[16px] text-[10px] font-medium text-[#7951E6] leading-[18px] font-sansation mt-2">
                  Expires In
                </span>
                <span className="sm:text-[16px] text-[10px] font-semibold text-black leading-[16px] font-sansation">
                  {/* { getExpiredIn(item?.startsAt, ) } */}
                  <CountdownTimer
                    onTimeout={() => {
                      onExpired(item?.assessmentId);
                    }}
                    timestamp={moment(item?.endsOn).diff(moment(), "minutes")}
                  />
                </span>
              </div>
            </div>
            <div className="sm:flex hidden items-center justify-center py-6 md:w-[20%] sm:w-full">
              {/* <button
                type="button"
                // disabled={
                //   isDisabled ||
                //   getAssessmentStatus(item?.module) ||
                //   assessmentExpired[item?.assessmentId]
                // }
                onClick={() => {
                  setDeviceConfigModal(true);
                  setSelectAssessment(item);
                }}
                className={`text-white font-sansation bg-[#CC8448] hover:bg-[#CC8448]/80 ${
                  getAssessmentStatus(item?.module)
                    ? "bg-[#CC8448]/80 cursor-not-allowed px-6"
                    : "px-12"
                } ${
                  assessmentExpired[item?.assessmentId]
                    ? "bg-[#CC8448]/80 cursor-not-allowed px-12"
                    : ""
                } focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md py-2.5 text-center inline-flex items-center`}
              >
                {getAssessmentStatus(item?.module) ? "Completed" : "Start"}
              </button> */}
              <button
                type="button"
                disabled={
                  isDisabled ||
                  getAssessmentStatus(item?.module) ||
                  assessmentExpired[item?.assessmentId]
                } // Enable the disabled attribute
                onClick={() => {
                  onStartModule(item);
                }}
                className={`text-white font-sansation bg-[#CC8448]
        ${isDisabled ? "cursor-not-allowed bg-[#CC8448]/60" : ""}
        ${
          getAssessmentStatus(item?.module)
            ? "px-6 cursor-not-allowed bg-[#CC8448]/60"
            : "px-12"
        }
        ${assessmentExpired[item?.assessmentId] ? "px-12" : ""}
        focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md py-2.5 text-center inline-flex items-center`}
              >
                {getStatus(item)}
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModuleExpired && (
        <ModuleExpiredModal
          onClose={() => {
            setIsModuleExpired(false);
          }}
        />
      )}
    </>
  );
}
export default MyAssessments;
