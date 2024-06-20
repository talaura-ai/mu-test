import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UnlockNextIcon from "../../assets/svg/unlockNext.svg";
import LockNextIcon from "../../assets/svg/lockIcon.svg";
import StartTestConfirmationModal from "../../components/startTestConfirmationModal";
import AssessmentCard from "../../components/assessmentCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAssessmentDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";

function AssessmentDetails () {
  const navigate = useNavigate();
  const [startTestModal, setStartTestModal] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<any>({});
  const dispatcher = useAppDispatch()
  const { assessmentId, userId } = useParams();
  const myAssessments = useAppSelector(getAssessmentsSelector)
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});

  const assessmentIdNew = "66716cae21292014904615c4"

  const onNextClicked = () => {
    setStartTestModal(false);
    console.log(selectedTest)
    if (selectedTest?.type === "Quiz") {
      navigate(`/assessment/${userId}/${assessmentIdNew}/${selectedTest?._id}`);
    } else if (selectedTest?.type === "Sandbox") {
      navigate(`/assessment/${userId}/${assessmentIdNew}/${selectedTest?._id}/coding`);
    } else if (selectedTest?.type === "Voice To Voice") {
      navigate(`/assessment/${userId}/${assessmentIdNew}/${selectedTest?._id}/voice-to-text`);
    } else if (selectedTest?.type === "Voice to Text") {
      navigate(`/assessment/${userId}/${assessmentIdNew}/${selectedTest?._id}/voice-to-text`);
    } else if (selectedTest?.type === "AI Video Interview") {
      navigate(`/assessment/${userId}/${assessmentIdNew}/${selectedTest?._id}/video-interview`);
    }
  };

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(v => v?._id === assessmentId)
      setSelectAssessment(data?.[0])
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
            className="flex flex-wrap justify-around mb-10 rounded-2xl relative py-3 bg-white shadow-lg"
          >
            <div className="absolute top-0 left-0 bottom-auto h-full flex items-center">
              <div className="w-[10px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)] rounded-r-xl"></div>
            </div>
            <div className="absolute -top-6 -left-4">
              { !item?.isLocked ? (
                <img src={ UnlockNextIcon } />
              ) : (
                <img src={ LockNextIcon } />
              ) }
            </div>
            <div className="flex flex-col items-center justify-center py-4 md:w-[25%] sm:w-full px-4">
              <span className="text-[22px] font-semibold text-[#F2BC84] self-center font-sansation">
                { item?.name }
              </span>
            </div>
            <div className="flex flex-col md:w-[25%] sm:w-full px-4">
              <span className="text-[20px] font-normal text-black font-sansation">Skills</span>
              <span className="text-[14px] font-medium text-[#BDBDBD] font-sansation">
                Objective-C/Swift Proficiency, Offline Storage & Threading,
                Performance Tuning, RESTful APIs Integration, Cloud Messaging.
              </span>
            </div>
            <div className="flex sm:justify-around md:justify-between md:w-[35%] sm:w-full px-2">
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Questions
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] font-sansation">
                  { item?.noOfQuestion || 0 }
                </span>
              </div>
              <div className="flex flex-col text-center items-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Weightage
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] min-w-[50px] border-b border-[#E5A971] font-sansation">
                  25%
                </span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-[20px] font-normal text-black font-sansation">
                  Duration
                </span>
                <span className="text-[20px] font-semibold text-[#BDBDBD] font-sansation">
                  { item?.time || 0 } min
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center py-6 md:w-[15%] sm:w-full">
              <button
                type="button"
                onClick={ () => {
                  setStartTestModal(true);
                  setSelectedTest(item);
                } }
                className="text-white bg-[#CC8448] hover:bg-[#CC8448]/80 font-sansation focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center"
              >
                Next
              </button>
            </div>
          </div>
        )) }
      </div>
      { startTestModal && (
        <StartTestConfirmationModal
          onClose={ () => {
            setStartTestModal(false);
          } }
          onNextClicked={ onNextClicked }
        />
      ) }
    </>
  );
}

export default AssessmentDetails;
