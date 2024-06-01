import { useNavigate, useParams } from "react-router-dom";
import AssessmentCard from "../../components/assessmentCard";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAssessmentDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getAssessmentsSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";

function PersonNeedMoreInfo () {
  const navigate = useNavigate();
  const dispatcher = useAppDispatch()
  const { assessmentId } = useParams();
  const myAssessments = useAppSelector(getAssessmentsSelector)
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const [assessmentQuestion, setAssessmentQuestion] = React.useState<any>([]);

  const onSaveClicked = () => {
    let flag = true
    let updateAssessmentQuestion = [...assessmentQuestion]
    updateAssessmentQuestion = updateAssessmentQuestion?.map((element) => {
      if (!element?.value) {
        flag = false
        return { ...element, isValid: true }
      }
      return { ...element, isValid: false }
    })
    if (flag) {
      navigate(`/assessment/${assessmentId}`);
    } else {
      setAssessmentQuestion(updateAssessmentQuestion)
    }
  };

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(v => v?._id === assessmentId)
      setSelectAssessment(data?.[0])
      setAssessmentQuestion(data?.[0]?.question)
    } else {
      setSelectAssessment({})
      setAssessmentQuestion([])
    }
  }, [myAssessments, assessmentId])

  React.useEffect(() => {
    dispatcher(setAssessmentDispatcher({ userId: "6654dfb48827c464882ef847" }))
  }, [dispatcher])

  const onValueChange = (value: string, index: number) => {
    const updatedQuestions = { ...assessmentQuestion[index], value, isValid: false };
    const newQuestions = [...assessmentQuestion];
    newQuestions[index] = updatedQuestions;
    setAssessmentQuestion(newQuestions);
  }

  return (
    <>
      <div className="sm:p-8 md:p-16 p-4">
        <AssessmentCard />
        <div
          className="flex flex-col mb-10 rounded-2xl bg-white p-8 shadow-lg"
        >
          <span className="text-[22px] font-semibold text-black font-sansation">
            Enter your Details
          </span>
          <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-4 pt-4">
            { assessmentQuestion?.map((v: any, index: number) => (
              <div className="flex flex-col min-h-20" key={ v?._id }>
                <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C] font-sansation">{ v?.title }<span className="text-[#FB2121]">*</span></label>
                <input onChange={ (e) => { onValueChange(e.target.value, index) } } type="text" id="error" className="bg-[#F2F1F1] font-sansation border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5" placeholder={ `Enter ${v?.title}` } />
                { v?.isValid ? <p className="mt-1 text-sm text-[#FB2121] font-sansation">Required</p> : null }
              </div>
            )) }
          </div>
        </div>
        <div className="flex items-center justify-end mt-12">
          <button
            type="button"
            onClick={ () => {
              onSaveClicked()
            } }
            className="text-white font-sansation bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default PersonNeedMoreInfo;
