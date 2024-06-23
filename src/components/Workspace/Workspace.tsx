import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";

const Workspace: React.FC<any> = ({ problem, moduleData }) => {
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);

  return (
    <Split className="split mt-6" minSize={0}>
      <ProblemDescription problem={problem} _solved={solved} />
      <div className="bg-white rounded-xl overflow-hidden ">
        <Playground
          problem={problem}
          moduleData={moduleData}
          setSuccess={setSuccess}
          setSolved={setSolved}
        />
      </div>
    </Split>
  );
};

export default Workspace;
