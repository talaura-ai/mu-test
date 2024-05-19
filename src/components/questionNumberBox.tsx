import CloseIcon from "../assets/svg/closeIcon.svg"
import CheckedIcon from "../assets/svg/checkedIcon.svg"
import WifiIcon from "../assets/svg/wifiIcon.svg"
import CameraIcon from "../assets/svg/cameraIcon.svg"
import MicIcon from "../assets/svg/micIcon.svg"

export default function QuestionNumberBox (props: any) {
  const data = [
    { name: "Mic", icon: MicIcon },
    { name: "Camera", icon: CameraIcon },
    { name: "Internet", icon: WifiIcon }
  ]
  return (
    <>
      <div className="flex flex-row items-center mx-6 py-4">
        1
      </div>
    </>
  );
}