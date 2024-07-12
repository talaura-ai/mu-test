export default function VoiceToTextInstructions ({ test }: any) {
  return (
    <>
      <div className="px-3 flex-auto">
        <div className="flex flex-col px-6 py-4 font-sansation">
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            Read the following instructions carefully.
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            1. <span className=" text-black text-[18px] font-medium">Ensure you have a stable internet connection. A wired connection is recommended over Wi-Fi to avoid connectivity issues</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            2. <span className=" text-black text-[18px] font-medium">There are { test?.noOfQuestions * 1 || 0 } questions in this test.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            3. <span className=" text-black text-[18px] font-medium">You have { test?.time || 0 } minutes to complete the test.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            4. <span className=" text-black text-[18px] font-medium">Your rank will be determined by the total marks you obtain. The higher your score, the better your rank</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            5. <span className=" text-black text-[18px] font-medium">Your answers will be evaluated by the AI based on accuracy, relevance, and completeness. Ensure your responses are as precise as possible.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            6. <span className=" text-black text-[18px] font-medium">Each question will be narrated by the AI. The questions will not be repeated, so make sure to listen attentively the first time.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            7. <span className=" text-black text-[18px] font-medium">Type your answer in the provided text editor. Ensure that your answers are accurate and clearly written</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            8. <span className=" text-black text-[18px] font-medium">You will be monitored throughout the assessment via webcam and microphone. Any suspicious activity may be flagged and could result in disqualification</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            9. <span className=" text-black text-[18px] font-medium">Always remain in front of your camera during the test. Moving out of the camera's view can be considered suspicious activity</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            10. <span className=" text-black text-[18px] font-medium">You cannot switch tabs during the test. If you switch tabs, your exam may be flagged or automatically submitted</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            11. <span className=" text-black text-[18px] font-medium">Sharing your screen or any part of your screen is strictly prohibited during the quiz.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            12. <span className=" text-black text-[18px] font-medium">If you close the quiz tab, your test will be automatically submitted. You will not be able to restart or resume the test once the tab is closed.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            13. <span className=" text-black text-[18px] font-medium">If the allocated time of { test?.time || 0 } minutes finishes, your test will be automatically submitted, regardless of how many questions you have answered and marked answers will be considered.</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            14. <span className=" text-black text-[18px] font-medium">Choose a quiet, well-lit room free from distractions. Make sure your desk or workspace is clear of any unauthorized materials</span>
          </span>
          <span className="text-[18px] font-semibold text-[#7A8A94] py-1">
            15. <span className=" text-black text-[18px] font-medium">No breaks are allowed during the assessment</span>
          </span>
        </div>

      </div>
    </>
  );
}