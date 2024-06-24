export default function VoiceToVideoInstructions ({ test }: any) {
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
            2. <span className=" text-black text-[20px] font-medium">The test consists of a varying number of questions, typically around 10-15. The exact number may change depending on your responses.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            3. <span className=" text-black text-[20px] font-medium">The test is conducted by an AI system, which will narrate each question. Pay close attention as each question is delivered only once.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            4. <span className=" text-black text-[20px] font-medium">The number of questions can vary based on your answers. The AI may adjust the questions in real-time according to your responses.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            5. <span className=" text-black text-[20px] font-medium">You are not allowed to switch tabs during the test. Attempting to do so may result in automatic submission or disqualification.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            6. <span className=" text-black text-[20px] font-medium">Always remain in front of your camera during the test. Moving out of the camera's view can be considered suspicious activity.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            7. <span className=" text-black text-[20px] font-medium">The AI will monitor for any suspicious behavior, including excessive movement, lack of focus, or attempts to use unauthorized materials. Suspicious activity may lead to your test being flagged or terminated.</span>
          </span>
          <span className="text-[20px] font-semibold text-[#7A8A94] py-1">
            8. <span className=" text-black text-[20px] font-medium">If you end the test, you will not be able to restart or reopen it. Ensure you are ready and have enough time before beginning the test.</span>
          </span>
        </div>
      </div>
    </>
  );
}