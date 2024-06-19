import React, { useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAssessmentModuleSelector } from "../../store/slices/dashboard-slice/dashboard-selectors";
import { setAssessmentModuleDispatcher } from "../../store/slices/dashboard-slice/dashboard-dispatchers";
// import { useSpeechSynthesis } from "react-speech-kit";
import ModuletestStartModal from "../../components/Modals/testStartModal";
import TextToSpeech, {
  TextToSpeechHandle,
} from "../../components/textToSpeech";
// import { useSpeechSynthesis } from "react-speech-kit";

const VoiceToText = () => {
  const dispatcher = useAppDispatch();
  const navigate = useNavigate();
  const { assessmentId, testId } = useParams();
  const assessmentModule = useAppSelector(getAssessmentModuleSelector);
  const [moduleQuestions, setModuleQuestions] = React.useState<any>([]);
  const [startTest, setStartTest] = React.useState(false);
  const ttsRef = React.useRef<TextToSpeechHandle>(null);
  const [text, setText] = React.useState(
    assessmentModule?.module?.question?.[0]?.title
  );

  //   const onEnd = () => {
  //     console.log("ENDED");
  //   };
  // const { speak, voices, cancel } = useSpeechSynthesis({
  //   onEnd
  // });
  // const voice = voices[ 0 ] || null;
  // speak({ text: text, voice, rate: 0.7, pitch: 0.5 });
  // cancel()

  console.log(
    "assessmentModule---TEXT",
    assessmentModule?.module?.question?.[0]?.title
  );

  React.useEffect(() => {
    if (assessmentModule?.module?.question) {
      setModuleQuestions(assessmentModule?.module?.question);
    }
  }, [assessmentModule]);

  React.useEffect(() => {
    dispatcher(
      setAssessmentModuleDispatcher({
        moduleId: testId,
        candidateId: "6672c49c3301a6048a286467",
        assessmentId: assessmentId,
      })
    );
  }, [dispatcher, assessmentId, testId]);

  const [editorState, seteditorState] = React.useState(
    EditorState.createEmpty()
  );

  const onEditorStateChange = (stats: any) => {
    seteditorState(stats);
    console.log(convertToRaw(stats.getCurrentContent()));
    console.log(draftToHtml(convertToRaw(stats.getCurrentContent())));
  };

  const onSubmission = (type: string) => {
    if (type === "start") {
      //   handleSpeak(0);
      handlePlayClick();
    }
    setStartTest(false);
  };

  //   const handleSpeak = (i: any) => {
  //     console.log("AAA", moduleQuestions);
  // speak({
  //   text: " hi,i am ",
  //   voice,
  //   rate: 1,
  //   pitch: 1,
  // });
  //   };

  useEffect(() => {
    let timer = setTimeout(() => {
      setStartTest(true);
    }, 500);

    // The cleanup function should return a function that clears the timeout
    return () => clearTimeout(timer);
  }, []);
  const handlePlayClick = () => {
    if (ttsRef.current) {
      ttsRef.current.play();
    }
  };

  const onNextClicked=()=>{
    
  }

  return (
    <div className="sm:p-6 md:px-20 md:py-12 p-4 bg-[#F9F7F0] h-screen">
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-4 border-b-2 border-[#7d7c78] pb-4 font-sansation">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            Module 2: Case Bssed
          </span>
        </div>
      </div>

      <div className="flex items-start justify-start flex-col w-[100%]  md:px-10  h-[100%] ">
        <div className="flex">
          <span className="text-md text-black">
            The AI will pose the question out loud, and the candidate must
            provide a typed response.
          </span>
        </div>
        <div className="flex my-4">
          <span className="text-[40px] font-semibold font-sansation text-[#CC8448] border-b-4 border-[#CC8448]">
            Case Study
          </span>
        </div>

        <div className="flex justify-between items-center  flex-col  md:flex-row w-full gap-4 p-2 md:h-2/3  h-full">
          <div className="flex md:w-2/5 w-full   h-[280px] md:h-full bg-[#474646] justify-center items-center rounded border border-[#E5A971]">
            <div className="flex bg-white  h-10 w-10 md:h-40 md:w-40 rounded-full justify-center items-center">
              <span className="text-[#E5A971]  text-[20px] md:text-[60px] font-semibold font-sansation">
                Ai{" "}
              </span>
            </div>
          </div>
          <div className="flex md:w-3/5 w-full  h-full justify-center items-center rounded bg-white  py-4 px-8">
            <div className="w-full  h-full  flex  overflow-hidden">
              <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                wrapperStyle={{ width: "100%" }}
                editorStyle={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  width: "100%",
                  border: "1px solid #f2f2f2",
                  borderRadius: "4px",
                }}
                onEditorStateChange={onEditorStateChange}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6  px-10 w-3/5 self-end">
          <button
            onClick={() => {
              //   props?.onNextClicked();
            }}
            type="button"
            className="font-sansation text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40"
          >
            Submit Test
          </button>
          <button
            onClick={() => {
               onNextClicked();
            }}
            type="button"
            className="font-sansation text-white bg-[#CC8448] hover:bg-[#CC8448]/80 focus:ring-4 focus:outline-none tracking-wide focus:ring-[#CC8448]/50 font-medium rounded-lg text-md px-16 py-2.5 text-center inline-flex items-center dark:hover:bg-[#CC8448]/80 dark:focus:ring-[#CC8448]/40"
          >
            Next
          </button>
        </div>
      </div>

      {startTest ? (
        <ModuletestStartModal
          onPress={(v) => {
            onSubmission(v);
          }}
        />
      ) : null}

      <TextToSpeech ref={ttsRef} text={text} />
    </div>
  );
};

export default VoiceToText;
