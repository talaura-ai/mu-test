import { useState, useEffect } from "react";
import Split from "react-split";
import Select from "react-select";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { whiteLight } from "@uiw/codemirror-theme-white";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { Base64 } from "js-base64";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getLanguagesDispatcher, getSendSubmissionDispatcher, getSubmissionStatusDispatcher } from "../../../store/slices/dashboard-slice/dashboard-dispatchers";
import { getLanguageSelector } from "../../../store/slices/dashboard-slice/dashboard-selectors";
import { selectiveLanguages, submissionStatuses, submissionStatusesColours } from "../../../constants";
export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
};

const Playground: React.FC<any> = ({ problem, setSuccess, setSolved }) => {
  const [activeTestCase, setActiveTestCase] = useState<boolean>(true);
  let [userCode, setUserCode] = useState<string>(problem?.starterCode);
  let [codeOutput, setCodeOutput] = useState<string>("");
  let [outputError, setOutputError] = useState<string>("");
  let [submissionStatus, setSubmissionStatus] = useState(0);
  const dispatcher = useAppDispatch()
  const languages = useAppSelector(getLanguageSelector);
  const fontSize = "16px";
  const [selectedOption, setSelectedOption] = useState<any>(selectiveLanguages?.[4]);

  const options = languages?.map((language: any) => ({
    value: language.id,
    label: language.name,
  }));

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });
  const pid = "";
  const handleSubmit = async () => {
    setCodeOutput("")
    setOutputError("")
    setActiveTestCase(true)
    setSubmissionStatus(0)
    try {
      let base64Encoded1 = Base64.encode(userCode);
      let std = Base64.encode(problem?.stdIn);
      let stdOut = Base64.encode(problem?.expectedAnswer);
      console.log(base64Encoded1);
      const res = await dispatcher(getSendSubmissionDispatcher(
        {
          "language_id": selectedOption?.value,
          "source_code": base64Encoded1,
          stdin: std,
          expected_output: stdOut
        }
      ))
      console.log('res=>', res)

      if (res?.payload?.data?.token) {
        const stats = await dispatcher(getSubmissionStatusDispatcher(`${res?.payload?.data?.token}?base64_encoded=true&fields=*`))
        console.log('stats=>', stats)
        setSubmissionStatus(stats?.payload?.data?.status_id || 0)
        if (stats?.payload?.data?.stdout) {
          let ans = Base64.decode(stats?.payload?.data?.stdout);
          let input = Base64.decode(stats?.payload?.data?.stdin);
          let expected_output = Base64.decode(stats?.payload?.data?.expected_output);
          console.log("ans", ans);
          console.log("input", input);
          console.log("expected_output", expected_output);
          setCodeOutput(ans)
        } else if (stats?.payload?.data?.stderr) {
          let decodedString = Base64.decode(stats?.payload?.data?.stderr);
          console.log(decodedString);
          setOutputError(decodedString)
        } else {
          setCodeOutput("No output")
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatcher(getLanguagesDispatcher());
  }, [dispatcher]);

  const onChange = (value: string) => {
    setUserCode(value);
    console.log(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };
  console.log('submissionStatus=>', submissionStatus)

  return (
    <div className="flex flex-col relative overflow-x-hidden rounded font-sansation">
      <div className="flex items-center justify-between w-full border border-b-0 font-sansation">
        <div className="flex items-center text-white  w-2/3  h-12 ">
          <div className="flex items-center text-white justify-left w-1/2  h-12  ">
            <div className="w-[8px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)]   top-auto left-0 bottom-auto"></div>
            <div className="text-2xl font-semibold text-label-2 text-black mx-4">
              Code Editor
            </div>
          </div>
          <div className="flex items-center px-1">
            <Select
              defaultValue={ selectedOption }
              onChange={ (v) => { setSelectedOption(v) } }
              options={ selectiveLanguages }
              className="text-base text-label-2 text-black focus:outline-none outline-none  w-[180px] text-left border-0 cursor-pointer"
              isSearchable={ false }
              styles={ customStyles }
            />
          </div>
        </div>
      </div>

      <Split
        className="h-[calc(100vh-108px)]"
        direction="vertical"
        sizes={ [60, 40] }
        minSize={ 60 }
      >
        <div className="w-full overflow-auto bg-white border">
          <CodeMirror
            value={ userCode }
            theme={ whiteLight }
            onChange={ onChange }
            basicSetup={ { foldGutter: false } }
            extensions={ [javascript(), java(), python(), cpp()] }
            style={ { fontSize: settings.fontSize, backgroundColor: "white" } }
          />
        </div>
        <div className="w-full px-5 border h-[100%]">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 h-[15%]">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2 cursor-pointer" onClick={ () => { setActiveTestCase(true) } }>
                <a className={ `inline-block p-4 border-b-2 border-transparent rounded-t-lg text-base font-medium leading-5 text-black font-sansation ${activeTestCase ? "text-blue-600 border-b-2 border-blue-600 font-semibold" : ""}` }>TestCases</a>
              </li>
              {/* <li className="me-2 cursor-pointer" onClick={ () => { setActiveTestCase(false) } }>
                <a className={ `inline-block p-4 rounded-t-lg text-base font-medium leading-5 font-sansation ${activeTestCase ? "" : "text-blue-600 border-b-2 border-blue-600 font-semibold"}` } aria-current="page">Output</a>
              </li> */}
            </ul>
          </div>

          <div className="h-[70%] overflow-scroll">
            <div className="flex">
              { problem?.examples?.map((example: any, index: number) => (
                <div
                  className="mr-2 items-start mt-2 "
                  key={ example?.id }
                // onClick={ () => setActiveTestCaseId(index) }
                >
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div
                      className={ `font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${0 === index ? "text-black" : "text-gray-500"}
									`}
                    >
                      Case { index + 1 }
                    </div>
                  </div>
                </div>
              )) }
            </div>
            { activeTestCase ? <div className="font-semibold rounded-lg px-4 min-h-[220px] flex-wrap text-wrap">
              <p className="text-sm font-medium mt-4 text-black">Input:</p>
              <div className="w-full cursor-text rounded-lg border px-3 py-[5px] border-transparent text-black mt-2">
                { problem?.stdIn }
              </div>
              <p className="text-sm font-medium mt-4 text-black">Output:</p>
              <div className="w-full cursor-text rounded-lg border px-3 py-[5px] border-transparent text-black mt-2">
                { problem?.expectedAnswer }
              </div>
              { submissionStatus > 0 ? <><div className="text-sm font-medium mt-4 text-black flex">Expected Output:
                <div className={ `text-wrap flex-shrink-0 cursor-text border border-transparent font-semibold ml-2 ${submissionStatus === 3 ? "text-[#19aa4c]" : "text-[#F00]"}` }>
                  { submissionStatuses[submissionStatus] }
                </div>
              </div>
                { codeOutput && <div className="text-wrap flex-shrink-0 cursor-text rounded-lg border px-3 py-[10px] border-transparent text-black mt-2">
                  <pre>{ codeOutput }</pre>
                </div> }
                { outputError && <div className="font-semibold mt-4 rounded-lg p-4 min-h-[220px]">
                  <pre>{ outputError }</pre>
                </div> }
              </> : null }
            </div> : null }
          </div>

          <div className="flex bottom-0 z-10 w-full font-sansation justify-end h-[15%]">
            <div className=" my-[10px] flex justify-between w-full">
              <div className="ml-auto flex items-center space-x-4">
                <button
                  className="px-3 py-1.5 text-base font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-[#19aa4a] border rounded gap-2"
                  onClick={ () => handleSubmit() }
                >
                  <FaPlay />
                  Run Code
                </button>
                <button
                  className=" w-[100px] justify-center px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-base text-white bg-[#19aa4c] hover:bg-green-800 rounded"
                  onClick={ () => handleSubmit() }
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

        </div>
      </Split>

    </div>
  );
};
export default Playground;
