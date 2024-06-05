export default function QuestionNumberBox ({ questionNo, checked, directQuestionClicked }: any) {
  return (
    <>
      <div
        onClick={ () => directQuestionClicked(questionNo) }
        className={ `flex w-[40px] h-[40px] text-[20px] font-normal flex-row items-center justify-center rounded-md font-sansation cursor-pointer ${!checked
          ? "border-[1.5px] border-solid border-[#B1B1B1] bg-white text-[#B1B1B1]"
          : "bg-[#F3BC84] bg-opacity-40 text-[#F3BC84]"
          }` }
      >
        { questionNo }
      </div>
    </>
  );
}
