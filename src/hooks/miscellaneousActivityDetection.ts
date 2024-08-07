import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { getUserActivityDispatcher } from "../store/slices/dashboard-slice/dashboard-dispatchers";
import { useParams } from "react-router-dom";

function useUserActivityDetection () {
  const dispatcher = useAppDispatch();
  const { userId } = useParams();

  const updateUserActivity = (type: string) => {
    dispatcher(getUserActivityDispatcher({
      candidateId: userId,
      type: type
    }));
  }

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      console.log('1111;;;;;;;Browser Closing')
      // Here you can handle logic before the unload event
      // const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
      // event.returnValue = message; // Standard for most browsers
      // return message; // For some older browsers
      return true
    };
    const handleUnload = () => {
      console.log('Page reloading')
      console.log('Page is being reloaded');
    };
    // window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    // Clean up event listeners on component unmount
    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  // // Alert on Tab Changed within the Same browser Window
  // function handleVisibilityChange () {
  //   if (document?.hidden) {
  //     console.log("11111:::::::Tab Change Detected", "Action has been Recorded", "error");
  //     // toast.error("Alert: Tab Change Detected", {});
  //     updateUserActivity()
  //     // the page is hidden
  //   } else {
  //     console.log("ACTIVE")
  //     // the page is visible
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('document.fullscreenElement', document.fullscreenElement)
      console.log('document.mozFullScreenElement', document.mozFullScreenElement)
      console.log('document.webkitFullscreenElement', document.webkitFullscreenElement)
      console.log('document.msFullscreenElement', document.msFullscreenElement)
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        updateUserActivity("exitFullScreen")
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (
        event?.key === 'F5' ||
        (event?.ctrlKey && event?.key === 'r') ||
        (event?.metaKey && event?.key === 'r') ||
        (event?.ctrlKey && event?.shiftKey && event?.key === 'r') ||
        (event?.metaKey && event?.shiftKey && event?.key === 'r')
      ) {
        event?.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  //Disable Right click
  useEffect(() => {
    const handleContextMenu = (event: any) => {
      event.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

}
export default useUserActivityDetection