export default function QuestionNumberBox({ questionNo, checked }: any) {
  return (
    <>
      <div
        className={`flex w-[40px] h-[40px] text-[20px] font-normal flex-row items-center justify-center rounded-md font-sansation ${
          checked
            ? "border-[1.5px] border-solid border-[#B1B1B1] bg-white text-[#B1B1B1]"
            : "bg-[#F3BC84] bg-opacity-40 text-[#F3BC84]"
        }`}
      >
        {questionNo}
      </div>
    </>
  );
}
