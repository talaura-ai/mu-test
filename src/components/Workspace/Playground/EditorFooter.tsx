import React from "react";
import { BsChevronUp } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";

type EditorFooterProps = {
  handleSubmit: () => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit }) => {
  return (
    <div className="flex absolute bottom-0 z-10 w-full">
      <div className="mx-5 my-[10px] flex justify-between w-full">
        {/* <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
          <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2">
            Console
            <div className="ml-1 transform transition flex items-center">
              <BsChevronUp className="fill-gray-6 mx-1 fill-dark-gray-6" />
            </div>
          </button>
        </div> */}
        <div className="ml-auto flex items-center space-x-4">
          <button
            className="px-3 py-1.5 text-base font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-[#19aa4a] border rounded gap-2"
            onClick={handleSubmit}
          >
            <FaPlay />
            Run Code
          </button>
          <button
            className=" w-[100px] justify-center px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-base text-white bg-[#19aa4c] hover:bg-green-800 rounded"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditorFooter;
