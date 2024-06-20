import { Outlet } from "react-router-dom";
import DashboardIcon from "../assets/svg/DashboardLayoutIcon.svg"
import { useLocation, useParams } from "react-router-dom";
import React from "react";
import TimerLoading from "../assets/Deadline.png"
import MiddleLogo from "../assets/middleLogo.png"
import { useAppSelector } from "../store/hooks";
import { getLoadingSelector } from "../store/slices/dashboard-slice/dashboard-selectors";

const CommonLayout = () => {
	let location = useLocation();
	const { userId } = useParams();
	const [active, setActive] = React.useState(true);
	const loading = useAppSelector(getLoadingSelector)

	React.useEffect(() => {
		if (location?.pathname) {
			if (location?.pathname?.includes("dashboard")) {
				setActive(true);
			} else {
				setActive(false);
			}
		}
	}, [location?.pathname]);

	return (
		<>
			<nav className="fixed top-0 z-50 w-full h-16 bg-white">
				<div className="px-3 lg:px-5 lg:pl-3 flex w-full items-center h-16">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center justify-start rtl:justify-end">
							<a href={ `/assessment/${userId}/dashboard` } className="flex md:ms-12 ms-2">
								<span className="text-xl font-semibold font-sansation text-transparent bg-clip-text bg-gradient-to-r from-[#E4A76F] to-[#F3BD85] self-center sm:text-2xl whitespace-nowrap">
									TalAura
								</span>
							</a>
						</div>
						<div className="flex items-center">
							<img src={ MiddleLogo } className="bg-blend-multiply h-[35px]" />
						</div>
						<div className="flex items-center">
							<div className="flex items-center md:mr-8">
								<div className="flex items-center">
									<button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300" aria-expanded="false" data-dropdown-toggle="dropdown-user">
										<span className="sr-only">Open user menu</span>
										<img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
									</button>
									<p className="text-sm font-semibold font-sansation text-gray-900 ml-2" role="none">
										Neil Sims
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			{ active && <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-16 h-screen pt-20 transition-transform -translate-x-full bg-white sm:translate-x-0" aria-label="Sidebar">
				<div className="h-full pb-4 overflow-y-auto bg-white">
					<ul className="space-y-2 font-medium mt-[95px]">
						<li className="bg-[#FFEFDF] flex justify-center">
							<a href="#" className="flex items-center py-3 text-[#e4a76f] rounded-lg group">
								<img src={ DashboardIcon }></img>
							</a>
						</li>
					</ul>
				</div>
			</aside> }

			<div className={ `${active && "sm:ml-16"}` }>
				<div id="middle-section" className={ `mt-16 ${active && "rounded-tl-xl"} bg-[#F9F7F0] overflow-y-scroll shadow-[inset_5px_5px_10px_#e1e1e1]` }>
					<Outlet />
				</div>
			</div>
			{ loading ? <>
				<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
					<div className="relative my-6 mx-auto w-[350px]">
						<div className="border-0 rounded-3xl shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
							<div className="flex items-center justify-center py-16">
								<img src={ TimerLoading } />
							</div>
						</div>
					</div>
				</div>
				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
			</> : null }
		</>
	);
};

export default CommonLayout;
