import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { problems } from "../../utils/problems";

const Workspace: React.FC<any> = ({ problem }) => {
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

	return (
		<Split className='split' minSize={ 0 }>
			<ProblemDescription problem={ problem } _solved={ solved } />
			<div className='bg-dark-fill-2'>
				<Playground problem={ problem } setSuccess={ setSuccess } setSolved={ setSolved } />
			</div>
		</Split>
	);
};

const ProblemPage: React.FC<any> = (props) => {
	const problem = problems["two-sum"];

	problem.handlerFunction = problem.handlerFunction?.toString();

	return (
		<div>
			<Workspace problem={ problem } />
		</div>
	);
};
export default ProblemPage;
