import errorIcon from "../../assets/error.png";

const CustomToaster = ({ message, onClose }: any) => {

  return (
    <div className="flex items-center justify-center w-[50%] mx-auto left-0 right-0 absolute top-32 animate-slide-down z-10">
      <div
        id="toast-warning"
        className="flex items-center justify-center w-full max-w-xs p-4  bg-white rounded-lg shadow border-red-500 border -mt-10"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-md ">
          <img src={ errorIcon } />
        </div>
        <div className="ms-3 text-sm font-normal text-red-500 toast__content ">
          { message }
        </div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-300 border-2 border-gray-300 rounded-full p-1  inline-flex items-center justify-center h-5 w-5 z-40"
          data-dismiss-target="#toast-warning"
          aria-label="Close"
          onClick={ () => { onClose() } }
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomToaster;
