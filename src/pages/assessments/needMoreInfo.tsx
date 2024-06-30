import { useNavigate, useParams } from "react-router-dom";
import AssessmentCard from "../../components/assessmentCard";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setAssessmentDispatcher,
  setAssessmentQuestionDispatcher,
} from "../../store/slices/dashboard-slice/dashboard-dispatchers";
import {
  getAssessmentsSelector,
  getAssessmentQuestionSelector,
} from "../../store/slices/dashboard-slice/dashboard-selectors";
import { toast } from "react-toastify";

function PersonNeedMoreInfo () {
  const navigate = useNavigate();
  const dispatcher = useAppDispatch();
  const { assessmentId, userId } = useParams();
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const myassessmentQuestion = useAppSelector(getAssessmentQuestionSelector);
  const [selectAssessment, setSelectAssessment] = React.useState<any>({});
  const [assessmentQuestion, setAssessmentQuestion] = React.useState<any>([]);

  const onSaveClicked = () => {
    let flag = true;
    let updateAssessmentQuestion = [...assessmentQuestion];
    updateAssessmentQuestion = updateAssessmentQuestion?.map((element) => {
      if (!element?.answer) {
        flag = false;
        return { ...element, isValid: true };
      }
      return { ...element, isValid: false };
    });
    if (flag) {
      dispatcher(
        setAssessmentQuestionDispatcher({
          userId,
          question: updateAssessmentQuestion,
        })
      );
      // toast.success("User detail has saved successfully!", {});
      navigate(`/assessment/${userId}/${assessmentId}/modules`);
    } else {
      setAssessmentQuestion(updateAssessmentQuestion);
    }
  };

  // //Disable Right click
  if (document.addEventListener) {
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter((v) => v?.assessmentId === assessmentId);
      setSelectAssessment(data?.[0]);
      setAssessmentQuestion(data?.[0]?.question);
    } else {
      setSelectAssessment({});
      setAssessmentQuestion([]);
    }
  }, [myAssessments, assessmentId]);

  React.useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }));
    }
  }, [dispatcher, userId]);

  const onValueChange = (value: string, index: number) => {
    const updatedQuestions = {
      ...assessmentQuestion[index],
      answer: value,
      isValid: false,
    };
    const newQuestions = [...assessmentQuestion];
    newQuestions[index] = updatedQuestions;
    setAssessmentQuestion(newQuestions);
  };

  return (
    <>
      <div className="sm:p-8 md:px-20 md:py-12 p-4">
        <AssessmentCard />
        <div className="flex flex-col mb-10 rounded-2xl bg-white p-8 shadow-lg">
          <span className="text-[22px] font-semibold text-black font-sansation">
            Enter your Details
          </span>
          <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-4 pt-4">
            { assessmentQuestion?.map((v: any, index: number) => (
              <div className="flex flex-col min-h-20" key={ v?._id }>
                <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C] font-sansation">
                  { v?.title }
                  <span className="text-[#FB2121]">*</span>
                </label>
                <input
                  defaultValue={ v?.answer }
                  onChange={ (e) => {
                    onValueChange(e.target.value, index);
                  } }
                  type="text"
                  id="error"
                  className="bg-[#F2F1F1] font-sansation border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5"
                  placeholder={ `Enter ${v?.title}` }
                />
                { v?.isValid ? (
                  <p className="mt-1 text-sm text-[#FB2121] font-sansation">
                    { `Please enter valid ${v?.name}` }
                  </p>
                ) : null }
              </div>
            )) }
          </div>
        </div>
        <div className="flex items-center justify-end mt-12">
          <button
            type="button"
            onClick={ () => {
              onSaveClicked();
            } }
            className="text-white font-sansation bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-12 py-2.5 text-center inline-flex items-center"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default PersonNeedMoreInfo;
