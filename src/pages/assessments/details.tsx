import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UnlockNextIcon from "../../assets/svg/unlockNext.svg";
import LockNextIcon from "../../assets/svg/lockIcon.svg";
import StartTestConfirmationModal from "../../components/startTestConfirmationModal";
import AssessmentCard from "../../components/assessmentCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAssessmentDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { toast } from "react-toastify";
import CompletedIcon from "../../assets/svg/completedIcon.svg"

function AssessmentDetails () {
  const navigate = useNavigate();
  const [startTestModal, setStartTestModal] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<any>({});
  const dispatcher = useAppDispatch()
  const { assessmentId, userId } = useParams();
  const myAssessments = useAppSelector(getAssessmentsSelector)
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }))
    }
  }, [location]);

  const onNextClicked = () => {
    setStartTestModal(false);
    const type = String(selectedTest?.type).toLocaleLowerCase()
    if (type === "Quiz"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}`);
    } else if (type === "Sandbox"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}/coding`);
    } else if (type === "Voice To Voice"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}/voice-to-voice`);
    } else if (type === "Voice To Text"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}/voice-to-text`);
    } else if (type === "AI Video Interview"?.toLocaleLowerCase()) {
      navigate(`/assessment/${userId}/${assessmentId}/${selectedTest?._id}/video-interview`);
    }
  };
  // var elem: any = document.documentElement;
  const elem: any = document.getElementById('fullscreenDiv');

  /* View in fullscreen */
  function openFullscreen () {
    if (elem?.requestFullscreen) {
      elem?.requestFullscreen();
    } else if (elem?.webkitRequestFullscreen) { /* Safari */
      elem?.webkitRequestFullscreen();
    } else if (elem?.msRequestFullscreen) { /* IE11 */
      elem?.msRequestFullscreen();
    }
    onNextClicked()
  }

  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 10;
    const heightThreshold = window.outerHeight - window.innerHeight > 121;
    if (widthThreshold || heightThreshold) {
      toast.error(`Alert: Your Dev Tools Opened, Please close them before proceed!`, {});
    } else {
      openFullscreen()
    }
  };

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(v => v?.assessmentId === assessmentId)
      let assessmentData = [...data?.[0]?.module]
      const newData = assessmentData?.sort((a: any, b: any) => Number(b?.position || 0) - Number(a?.position || 0));
      setSelectAssessment({ module: newData })
    } else {
      setSelectAssessment({})
    }
  }, [myAssessments, assessmentId])

  React.useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }))
    }
  }, [dispatcher, userId])

  return (
    <>
      <div className="sm:p-8 md:px-20 md:py-12 p-4">
        <AssessmentCard />
        { selectAssessment?.module?.map((item: any) => (
          <div
            key={ item }
            className="flex flex-wrap justify-around mb-10 rounded-2xl relative py-6 bg-white shadow-lg mx-[150px]"
          >
            <div className="absolute top-0 left-0 bottom-auto h-full flex items-center">
              <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl"></div>
            </div>
            <div className="absolute -top-6 -left-4">
              { item?.status === "Completed" ? <img src={ CompletedIcon } /> : (!item?.isLocked ? (
                <img src={ UnlockNextIcon } />
              ) : (
                <img src={ LockNextIcon } />
              )) }
            </div>
            <div className="flex flex-col justify-center py-4 md:w-[45%] sm:w-full pr-6 pl-10">
              <span className="text-[22px] font-semibold text-[#F2BC84] font-sansation">
                { item?.name }
              </span>
            </div>
            {/* <div className="flex flex-col md:w-[20%] sm:w-full px-4 justify-center ">
              <span className="text-[20px] font-normal text-black font-sansation">Skills</span>
              <span className="text-[14px] font-medium text-[#BDBDBD] font-sansation">
                { item?.skills?.join(", ") }
              </span>
            </div> */}
            <div className="flex sm:justify-around md:justify-around md:w-[55%] items-center justify-center sm:w-full px-2">
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Questions
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] font-sansation">
                  { item?.noOfQuestion || 0 }
                </span>
              </div>
              {/* <div className="flex flex-col text-center items-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Weightage
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] min-w-[50px] border-b border-[#E5A971] font-sansation">
                  { item?.weightage || 0 }%
                </span>
              </div> */}
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Duration
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] font-sansation">
                  { item?.time || 0 } min
                </span>
              </div>
              <div className="flex flex-col text-center">
                { item?.status === "Completed" ? <button
                  type="button"
                  className="text-white bg-[#CC8448]/80 font-sansation tracking-wide font-medium rounded-lg text-md px-6 py-2.5 text-center inline-flex items-center cursor-not-allowed"
                >
                  Completed
                </button> : <button
                  type="button"
                  disabled={ item?.isLocked }
                  onClick={ () => {
                    setStartTestModal(true);
                    setSelectedTest(item);
                  } }
                  className={ `text-white bg-[#CC8448] hover:bg-[#CC8448]/80 ${item?.isLocked ? "bg-[#CC8448]/80 cursor-not-allowed" : ""} font-sansation focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center` }
                >
                  Start
                </button> }
              </div>
            </div>
            {/* <div className="flex items-center justify-center py-6 md:w-[15%] sm:w-full">
              { item?.status === "Completed" ? <button
                type="button"
                className="text-white bg-[#CC8448]/80 font-sansation tracking-wide font-medium rounded-lg text-md px-6 py-2.5 text-center inline-flex items-center cursor-not-allowed"
              >
                Completed
              </button> : <button
                type="button"
                disabled={ item?.isLocked }
                onClick={ () => {
                  setStartTestModal(true);
                  setSelectedTest(item);
                } }
                className={ `text-white bg-[#CC8448] hover:bg-[#CC8448]/80 ${item?.isLocked ? "bg-[#CC8448]/80 cursor-not-allowed" : ""} font-sansation focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center` }
              >
                Start
              </button> }
            </div> */}
          </div>
        )) }
      </div>
      { startTestModal && (
        <StartTestConfirmationModal
          onClose={ () => {
            setStartTestModal(false);
          } }
          onNextClicked={ checkDevTools }
          selectedTest={ selectedTest }
        />
      ) }
    </>
  );
}

export default AssessmentDetails;
