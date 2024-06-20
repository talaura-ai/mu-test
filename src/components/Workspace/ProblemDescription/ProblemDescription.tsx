import CircleSkeleton from "../../Skeletons/CircleSkeleton";
import RectangleSkeleton from "../../Skeletons/RectangleSkeleton";
import { useEffect, useState } from "react";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";

const ProblemDescription: React.FC<any> = ({ problem, _solved }) => {
  const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
    useGetCurrentProblem(problem?.id);
  const { liked, disliked, solved, setData, starred } =
    useGetUsersDataOnProblem(problem?.id);
  const [updating, setUpdating] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border font-sansation">
      {/* TAB */ }
      <div className="flex w-full items-center  text-black overflow-hidden h-12 border-b">
        <div className="w-[8px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)]   top-auto left-0 bottom-auto"></div>
        <div
          className={
            "rounded-t-[5px] px-5 text-md cursor-pointer text-2xl font-semibold  text-label-2 text-black"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-108px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */ }
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-black font-medium">
                { problem?.title }
              </div>
            </div>
            {/* { !loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={ `${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize ` }
                >
                  { currentProblem?.difficulty }
                </div>
              </div>
            ) } */}

            {/* Problem Statement(paragraphs) */ }
            {/* <div className="text-black text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problem?.problemStatement }}
              />
            </div> */}

            {/* Examples */ }
            {/* <div className="mt-4">
              { problem?.examples?.map((example: any, index: number) => (
                <div key={ example?.id }>
                  <p className="font-medium text-black ">
                    Example { index + 1 }:{ " " }
                  </p>
                  { example.img && (
                    <img src={ example.img } alt="" className="mt-3" />
                  ) }
                  <div className="example-card">
                    <pre>
                      <strong className="text-black">Input: </strong>{ " " }
                      { example.inputText }
                      <br />
                      <strong>Output:</strong>
                      { example.outputText } <br />
                      { example.explanation && (
                        <>
                          <strong>Explanation:</strong> { example.explanation }
                        </>
                      ) }
                    </pre>
                  </div>
                </div>
              )) }
            </div> */}

            {/* Constraints */ }
            {/* <div className="my-8 pb-4">
              <div className="text-black text-sm font-medium">Constraints:</div>
              <ul className="text-black ml-5 list-disc ">
                <div
                  dangerouslySetInnerHTML={{ __html: problem?.constraints }}
                />
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;

function useGetCurrentProblem (problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemDifficultyClass, setProblemDifficultyClass] =
    useState<string>("");

  return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem (problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  return { ...data, setData };
}
