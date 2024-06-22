import { VscTriangleUp } from "react-icons/vsc";

export default function QuestionNumberBox ({ questionNo, checked, directQuestionClicked, review }: any) {
  return (
    <>
      <div
        onClick={ () => directQuestionClicked(questionNo) }
        className={ `relative overflow-hidden flex w-[40px] h-[40px] text-[20px] font-normal flex-row items-center justify-center rounded-md font-sansation cursor-pointer ${!checked
          ? "border-[1.5px] border-solid border-[#B1B1B1] bg-white text-[#B1B1B1]"
          : "bg-[#F3BC84] bg-opacity-40 text-[#F3BC84]"
          }` }
      >
        { questionNo }
        { review ? <VscTriangleUp className={ `rotate-45 text-[#40B24B] absolute ${!checked ? "-top-[12px] -right-[12px]" : "-top-[10px] -right-[10px]"}` } size={ 32 } /> : null }
      </div>
    </>
  );
}
