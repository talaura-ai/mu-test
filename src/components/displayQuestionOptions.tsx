import { alphabetArray } from "../utils/helper";

export default function QuestionOptionBox ({ checked, option, index, onSelection }: any) {

  return (
    <>
      <div
        onClick={ () => onSelection(option) }
        className={ `flex items-center w-[60%] font-normal rounded-[5px] border-[2px] border-solid py-2 px-3 cursor-pointer font-sansation
        ${checked === option
            ? "border-[#E5A971] bg-[#FAE6D1]"
            : "border-[#B1B1B1] bg-white"
          }
        `}
      >
        <div className="w-[42px]">
          <div
            className={ `w-[35px] h-[35px] flex justify-center items-center rounded-full border-solid border-[2px] text-black text-[18px] font-normal font-sansation select-none
            ${checked === option ? "border-[#E5A971]" : "border-[#B1B1B1]"}
        `}
          >{ alphabetArray?.[index] }
          </div>
        </div>
        <p className=" text-black text-[18px] font-normal pl-2 font-sansation select-none">{ option }</p>
      </div>
    </>
  );
}
