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
const pattern = /^[0-9]*$/;
function PersonNeedMoreInfo() {
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
      let isValid = false;
      if (!element?.answer) {
        flag = false;
        return { ...element, isValid: true };
      }
      if (element?.name?.trim() === "Phone Number") {
        if (pattern.test(element?.answer) && element?.answer?.length === 10) {
        } else {
          isValid = true;
          flag = false;
        }
      } else {
        if (element?.name?.trim() === "Semester") {
          if (pattern.test(element?.answer) && element?.answer?.length === 1) {
          } else {
            flag = false;
            isValid = true;
          }
        } else {
          if (element?.name?.includes("Backlog")) {
            if (
              pattern.test(element?.answer) &&
              element?.answer?.length === 1
            ) {
            } else {
              flag = false;
              isValid = true;
            }
          }
        }
      }
      return { ...element, isValid: isValid };
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
  // if (document.addEventListener) {
  //   document.addEventListener(
  //     "contextmenu",
  //     function (e) {
  //       e.preventDefault();
  //     },
  //     false
  //   );
  // }

  React.useEffect(() => {
    if (assessmentId && myAssessments?.length) {
      const data = myAssessments?.filter(
        (v) => v?.assessmentId === assessmentId
      );
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

  const onValueChange = (value: string, index: number, v: any) => {
    const updatedQuestions = {
      ...assessmentQuestion[index],
      answer: value,
      isValid: false,
    };
    const newQuestions = [...assessmentQuestion];
    newQuestions[index] = updatedQuestions;
    setAssessmentQuestion(newQuestions);
  };

  const getErrorText = (name: any) => {
    if (name?.includes("Semester")) {
      return `Please enter valid ${name} (Eg. 1,2,3,4)`;
    }
    if (name?.includes("Backlog")) {
      return `Please enter valid ${name} (Eg. 0,1,2,3,4)`;
    }
    return `Please enter valid ${name}`;
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
            {assessmentQuestion?.map((v: any, index: number) => (
              <div className="flex flex-col min-h-20" key={v?._id}>
                <label className="block mb-2 text-[18px] font-medium text-[#7D7C7C] font-sansation">
                  {v?.title || v?.name}
                  <span className="text-[#FB2121]">*</span>
                </label>
                <input
                  defaultValue={v?.answer}
                  value={v?.answer}
                  onChange={(e) => {
                    onValueChange(e.target.value, index, v);
                  }}
                  // type="text"
                  type={`${v?.name.trim() == "Semester" ? "number" : "text"}`}
                  maxLength={v?.name.trim() == "Phone Number" ? 10 : 30}
                  id="error"
                  className="bg-[#F2F1F1] font-sansation border border-[#C2C2C2] text-[#222222] placeholder-[#9F9D9D] text-sm rounded-[5px] block w-full p-2.5"
                  placeholder={`Enter ${v?.title || v?.name}`}
                />
                {v?.isValid ? (
                  <p className="mt-1 text-sm text-[#FB2121] font-sansation">
                    {getErrorText(v?.name)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end mt-12">
          <button
            type="button"
            onClick={() => {
              onSaveClicked();
            }}
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
