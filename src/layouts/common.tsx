import { Outlet } from "react-router-dom";
import DashboardIcon from "../assets/svg/DashboardLayoutIcon.svg";
import { useLocation, useParams } from "react-router-dom";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getAssessmentsSelector,
  getLoadingSelector,
  getQuizLoadingSelector,
} from "../store/slices/dashboard-slice/dashboard-selectors";
import { setAssessmentDispatcher } from "../store/slices/dashboard-slice/dashboard-dispatchers";
import { ReactSVG } from "react-svg";

const CommonLayout = () => {
  let location = useLocation();
  const { userId } = useParams();
  const [active, setActive] = React.useState(true);
  const loading = useAppSelector(getLoadingSelector);
  const quizLoading = useAppSelector(getQuizLoadingSelector);
  const myAssessments = useAppSelector(getAssessmentsSelector);
  const dispatcher = useAppDispatch();

  React.useEffect(() => {
    if (location?.pathname) {
      if (location?.pathname?.includes("dashboard")) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [location?.pathname]);

  React.useEffect(() => {
    if (userId) {
      sessionStorage.setItem("talaura-x-u-r", userId);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) {
      dispatcher(setAssessmentDispatcher({ userId }));
    }
  }, [dispatcher, userId]);

  return (
    <>
      <nav className="fixed top-0 z-40 w-full h-16 bg-white">
        <div className="px-3 lg:px-5 lg:pl-3 flex w-full items-center h-16">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start rtl:justify-end">
              <a
                href={`/assessment/${userId}/dashboard`}
                className="flex md:ms-16 ms-2"
              >
                <span className="text-xl font-semibold font-sansation text-transparent bg-clip-text bg-gradient-to-r from-[#E4A76F] to-[#F3BD85] self-center sm:text-2xl whitespace-nowrap">
                  TalAura
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center md:mr-8">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-[#E66B50] rounded-full">
                      <span className="text-white text-[20px] font-sansation font-bold capitalize">
                        {myAssessments && myAssessments?.[0]?.name
                          ? myAssessments?.[0]?.name?.substring(0, 1)
                          : ""}
                      </span>
                    </div>
                  </button>
                  <p
                    className="text-sm font-semibold font-sansation text-gray-900 ml-2 capitalize"
                    role="none"
                  >
                    {(myAssessments && myAssessments?.[0]?.name) || "Candidate"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {active && (
        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-16 h-screen pt-20 transition-transform -translate-x-full bg-white sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full pb-4 overflow-y-auto bg-white">
            <ul className="space-y-2 font-medium mt-[95px]">
              <li className="bg-[#FFEFDF] flex justify-center">
                <a
                  href="#"
                  className="flex items-center py-3 text-[#e4a76f] rounded-lg group"
                >
                  <ReactSVG src={DashboardIcon}></ReactSVG>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      )}

      <div id="fullscreenDiv" className={`${active && "sm:ml-16"}`}>
        <div
          id="middle-section"
          className={`mt-16 ${
            active && "rounded-tl-xl"
          } bg-[#F9F7F0] overflow-y-scroll shadow-[inset_5px_5px_10px_#e1e1e1]`}
        >
          <Outlet />
        </div>
        {loading ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative mx-auto w-[150px] h-[150px]">
                <div className="border-0 rounded-3xl shadow-md relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="loader">
                      <span className="hour"></span>
                      <span className="min"></span>
                      <span className="circel"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {quizLoading ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative mx-auto w-[500px] h-[220px]">
                <div className="border-0 rounded-3xl shadow-md relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
                  <div className="flex items-center justify-center w-full h-full mt-2">
                    <div className="loader">
                      <span className="hour"></span>
                      <span className="min"></span>
                      <span className="circel"></span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-black text-[20px] font-sansation font-semibold">
                      Almost there!
                    </p>
                  </div>
                  <p className="text-black leading-relaxed px-2 font-sansation font-bold text-[18px] text-center pb-6">
                    Your personalized quiz will be generated in 30 seconds
                  </p>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default CommonLayout;
