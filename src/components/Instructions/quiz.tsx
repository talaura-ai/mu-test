export default function QuizInstructions ({ test }: any) {
  return (
    <>
      <div className="px-3 flex-auto">
        <div className="flex flex-col px-6 py-4 font-sansation">
          <span className="text-[20px] font-semibold text-[#7A8A94]">
            Duration: <span className=" text-black text-[20px] font-medium">{ test?.time || 0 } Mins</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            Maximum Marks: <span className=" text-black text-[20px] font-medium">{ test?.noOfQuestion * 1 || 0 }</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            Read the following instructions carefully.
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            1. <span className=" text-black text-[20px] font-medium">There are { test?.noOfQuestion * 1 || 0 } questions in this quiz.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            2. <span className=" text-black text-[20px] font-medium">You have { test?.time || 0 } minutes to complete the quiz.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            3. <span className=" text-black text-[20px] font-medium">Your rank will be determined by the total marks you obtain. The higher your score, the better your rank.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            4. <span className=" text-black text-[20px] font-medium">You will receive  </span>1 mark for each correct answer.
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            5. <span className=" text-black text-[20px] font-medium">No marks will be awarded or deducted for incorrect or skipped answers (0 marks).</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            6. <span className=" text-black text-[20px] font-medium">You cannot switch tabs during the test. If you switch tabs, your exam may be flagged or automatically submitted.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            7. <span className=" text-black text-[20px] font-medium">Sharing your screen or any part of your screen is strictly prohibited during the quiz.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            8. <span className=" text-black text-[20px] font-medium">If you close the quiz tab, your test will be automatically submitted. You will not be able to restart or resume the test once the tab is closed.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            9. <span className=" text-black text-[20px] font-medium">If the allocated time of { test?.time || 0 } minutes finishes, your test will be automatically submitted, regardless of how many questions you have answered.</span>
          </span>
        </div>

      </div>
    </>
  );
}