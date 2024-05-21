import { useState, useEffect } from "react";
import { ISettings } from "../Playground";
import SettingsModal from "../../../Modals/SettingsModal";
import Select from "react-select";

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({
  setSettings,
  settings,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: "Javacript",
    label: "Javacript",
  });

  const options = [
    { value: "Javacript", label: "Javacript" },
    { value: "NodeJs", label: "NodeJs" },
    { value: "AngularJs", label: "AngularJs" },
  ];

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  return (
    <div className="flex items-center justify-between w-full ">
      <div className="flex items-center text-white justify-between w-2/3">
        <div className="w-[8px] md:h-[64px] sm:h-[130px] bg-gradient-to-r from-[#E5A971] to-[rgb(243,188,132)]  absolute top-auto left-0 bottom-auto"></div>
        <div className="text-2xl font-semibold mx-6 text-label-2 text-black">
          Code Editor
        </div>

        <button className="flex cursor-pointer items-center rounded focus:outline-none px-2 py-1.5 font-medium">
          <div className="flex items-center px-1 ">
            <Select
              defaultValue={selectedOption}
              onChange={() => setSelectedOption}
              options={options}
              className="text-base text-label-2 text-gray-400 focus:outline-none outline-none  w-[180px] text-left"
              isSearchable={false}
            />
          </div>
        </button>
      </div>

      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};
export default PreferenceNav;
