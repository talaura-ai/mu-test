import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { whiteLight } from "@uiw/codemirror-theme-white";
import { toast } from "react-toastify";
import { problems } from "../../../utils/problems";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { Base64 } from "js-base64";
import { useAppDispatch } from "../../../store/hooks";
import { getSendSubmissionDispatcher, getSubmissionStatusDispatcher } from "../../../store/slices/dashboard-slice/dashboard-dispatchers";
export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground: React.FC<any> = ({ problem, setSuccess, setSolved }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem?.starterCode);
  let [codeOutput, setCodeOutput] = useState<string>("");
  const dispatcher = useAppDispatch()
  const fontSize = "16px";

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });
  const pid = "";
  const handleSubmit = async () => {
    setCodeOutput("")
    try {
      let base64Encoded1 = Base64.encode(userCode);
      console.log(base64Encoded1);
      const res = await dispatcher(getSendSubmissionDispatcher(
        {
          "language_id": 93,
          "source_code": base64Encoded1,
        }
      ))
      console.log('res=>', res)

      if (res?.payload?.data?.token) {
        const stats = await dispatcher(getSubmissionStatusDispatcher(`${res?.payload?.data?.token}?base64_encoded=true&fields=*`))
        console.log('stats=>', stats)
        if (stats?.payload?.data?.stdout) {
          let decodedString = Base64.decode(stats?.payload?.data?.stdout);
          console.log(decodedString);
          setCodeOutput(decodedString)
        } else {
          setCodeOutput("N/A")
        }
        if (stats?.payload?.data?.stderr) {
          let decodedString = Base64.decode(stats?.payload?.data?.stderr);
          console.log(decodedString);
          setCodeOutput(decodedString)
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`);
  }, [pid, problem?.starterCode]);

  const onChange = (value: string) => {
    setUserCode(value);
    console.log(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };

  return (
    <div className="flex flex-col relative overflow-x-hidden rounded font-sansation">
      <PreferenceNav settings={ settings } setSettings={ setSettings } />

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
            extensions={ [javascript()] }
            style={ { fontSize: settings.fontSize, backgroundColor: "white" } }
          />
        </div>
        <div className="w-full px-5 overflow-auto border">
          {/* testcase heading */ }
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-base font-medium leading-5 text-black">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-black" />
            </div>
            <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
              <div className="relative flex h-full flex-col justify-center cursor-pointer">
                <button className="px-3 py-1.5 font-base items-center transition-all inline-flex bg-dark-fill-3 text-base hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2  ">
                  Console
                  <div className="ml-1 transform transition flex items-center">
                    <IoIosArrowDown className="fill-gray-6 mx-1 fill-dark-gray-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            { problem?.examples?.map((example: any, index: number) => (
              <div
                className="mr-2 items-start mt-2 "
                key={ example?.id }
                onClick={ () => setActiveTestCaseId(index) }
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={ `font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-black" : "text-gray-500"}
									`}
                  >
                    Case { index + 1 }
                  </div>
                </div>
              </div>
            )) }
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-black">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] border-transparent text-black mt-2">
              { problem?.examples?.[activeTestCaseId]?.inputText }
            </div>
            <p className="text-sm font-medium mt-4 text-black">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] border-transparent text-black mt-2">
              <pre>{ codeOutput }</pre>
            </div>
          </div>
        </div>
      </Split>
      <div className="flex absolute bottom-0 z-10 w-full font-sansation">
        <div className="mx-5 my-[10px] flex justify-between w-full">
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
  );
};
export default Playground;
