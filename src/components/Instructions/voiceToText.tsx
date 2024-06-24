export default function VoiceToTextInstructions ({ test }: any) {
  return (
    <>
      <div className="px-3 flex-auto">
        <div className="flex flex-col px-6 py-4 font-sansation">
          <span className="text-[20px] font-semibold text-[#7A8A94]">
            Duration: <span className=" text-black text-[20px] font-medium">{ test?.time || 0 } Mins</span>
          </span>
          {/* <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            Maximum Marks: <span className=" text-black text-[20px] font-medium">{ test?.noOfQuestion * 1 || 0 }</span>
          </span> */}
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            Read the following instructions carefully.
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            1. <span className=" text-black text-[20px] font-medium">You have { test?.time || 0 } minutes to complete the test.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            2. <span className=" text-black text-[20px] font-medium">There are { test?.noOfQuestion * 1 || 0 } questions in this test.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            3. <span className=" text-black text-[20px] font-medium">Each question will be narrated by the AI. The questions will not be repeated, so make sure to listen attentively the first time.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            4. <span className=" text-black text-[20px] font-medium">Type your answer in the provided text editor. Ensure that your answers are accurate and clearly written.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            5. <span className=" text-black text-[20px] font-medium">Your answers will be evaluated by the AI based on accuracy, relevance, and completeness. Ensure your responses are as precise as possible.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            6. <span className=" text-black text-[20px] font-medium">You cannot switch tabs during the test. If you switch tabs, your test may be flagged or automatically submitted.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            7. <span className=" text-black text-[20px] font-medium">Sharing your screen or any part of your screen is strictly prohibited during the test.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            8. <span className=" text-black text-[20px] font-medium">If you close the test tab, your test will be automatically submitted. You will not be able to restart or resume the test once the tab is closed.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            9. <span className=" text-black text-[20px] font-medium">If the allotted { test?.time || 0 } minutes expire, your test will be automatically submitted, regardless of how many questions you have answered.</span>
          </span>
        </div>

      </div>
    </>
  );
}