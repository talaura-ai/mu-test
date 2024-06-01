export default function QuestionOptionBox ({ checked, option }: any) {
  return (
    <>
      <div
        className={ `flex items-center w-[50%] font-normal rounded-[5px] border-[2px] border-solid py-2 px-3 cursor-pointer font-sansation
        ${checked
            ? "border-[#E5A971] bg-[#FAE6D1]"
            : "border-[#B1B1B1] bg-white"
          }
        `}
      >
        <div
          className={ `w-[35px] h-[35px] flex justify-center items-center rounded-full border-solid border-[2px]
        ${checked ? "border-[#E5A971]" : "border-[#B1B1B1]"}
        `}
        >
          <p className=" text-black text-[18px] font-normal font-sansation">{ option?.option }</p>
        </div>
        <p className=" text-black text-[18px] font-normal pl-3 font-sansation">{ option?.title }</p>
      </div>
    </>
  );
}
