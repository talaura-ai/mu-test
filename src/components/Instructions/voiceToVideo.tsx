export default function VoiceToVideoInstructions({ test }: any) {
  return (
    <>
      <div className="sm:px-3 flex-auto">
        <div className="flex flex-col px-6 py-4 font-sansation">
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            Read the following instructions carefully.
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            1.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              Ensure you have a stable internet connection. Choose a quiet,
              well-lit room free from distractions.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            2.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              The interview consists of a varying number of questions. The exact
              number may change depending on your responses.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            3.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              You have {test?.time || 0} minutes to complete the interview.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            4.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              The interview is conducted by an AI system, which will narrate
              each question.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            5.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              You will be monitored throughout the interview via webcam and
              microphone. Any suspicious activity may be flagged and could
              result in disqualification.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            6.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              Always remain in front of your camera during the interview. Moving
              out of the camera's view can be considered suspicious activity.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            7.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              You cannot switch tabs during the interview. If you switch tabs,
              your interview may be flagged or automatically submitted.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            8.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              Sharing your screen or any part of your screen is strictly
              prohibited during the interview.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            9.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              If you submit the interview, you will not be able to restart or
              reopen it.
            </span>
          </span>
          {/* <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            10.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              You cannot switch tabs during the test. If you switch tabs, your
              exam may be flagged or automatically submitted
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            11.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              Sharing your screen or any part of your screen is strictly
              prohibited during the test.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            12.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              {" "}
              If you close the quiz tab, your test will be automatically
              submitted. You will not be able to restart or resume the test once
              the tab is closed.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            13.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              If the allocated time of {test?.time || 0} minutes finishes, your
              test will be automatically submitted, regardless of how many
              questions you have answered and marked answers will be considered.
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            14.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              Choose a quiet, well-lit room free from distractions. Make sure
              your desk or workspace is clear of any unauthorized materials
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            15.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              No breaks are allowed during the assessment
            </span>
          </span>
          <span className="sm:text-[18px] text-[11px] font-semibold text-[#7A8A94] py-1">
            16.{" "}
            <span className=" text-black sm:text-[18px] text-[11px] font-medium">
              If you end the test, you will not be able to restart or reopen it.
              Ensure you are ready and have enough time before beginning the
              test
            </span>
          </span> */}
        </div>
      </div>
    </>
  );
}
