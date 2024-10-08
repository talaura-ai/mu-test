import React from "react";
import TimeLeftIcon from "../assets/svg/timeLeftIcon.svg";
import VideoTimeoutIcon from "../assets/svg/videoTimeout.svg";
import { useTimer } from "react-timer-hook";
import { useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";

export default function TimerCounterWithProgress({
  timestamp,
  title,
  onTimeout,
  showTimer = true,
  showProgressFromLT = false,
}: any) {
  const { testId, userId } = useParams();
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60 * timestamp);
  const { seconds, minutes, hours, restart, totalSeconds } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      onTimeout();
    },
  });
  React.useEffect(() => {
    if (timestamp) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60 * timestamp);
      restart(time);
    }
  }, [timestamp]);

  React.useEffect(() => {
    if (timestamp > 0) {
      sessionStorage.setItem(
        `txp-${testId}-${userId}`,
        String(`${minutes + seconds / 60}`)
      );
    }
  }, [seconds, minutes]);

  const getTimeProgress = () => {
    if (showProgressFromLT) {
      let newMin = timestamp * 60 - totalSeconds;
      return `${
        Math.floor(newMin / 60) < 10
          ? `0${Math.floor(newMin / 60)}`
          : Math.floor(newMin / 60)
      }:${
        Math.floor(newMin % 60) < 10
          ? `0${Math.floor(newMin % 60)}`
          : Math.floor(newMin % 60)
      }`;
    }
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  return (
    <>
      <div className="flex md:flex-row flex-col items-center md:justify-between sm:mb-6 mb-2 font-sansation w-[100%]">
        <div className="flex items-center sm:justify-between justify-center w-[65%] flex-wrap text-wrap">
          <span className="font-bold text-black self-center sm:text-2xl md:text-[32px] text-[20px] flex">
            {title}
          </span>
        </div>
        {showTimer ? (
          <div className="flex items-center sm:mt-4 mt-2 justify-center w-full">
            <div className="w-full flex sm:justify-end justify-center">
              <p
                className={`text-[18px] ${
                  showProgressFromLT ? "text-[#CC8448]" : "text-[#FB2121]"
                } font-semibold`}
              >
                {showProgressFromLT ? "Time Lapsed" : "Auto submit in"}
              </p>

              {showProgressFromLT ? (
                <ReactSVG src={VideoTimeoutIcon} className="px-2" />
              ) : (
                <ReactSVG src={TimeLeftIcon} className="px-2" />
              )}
              <p
                className={`text-[18px] ${
                  showProgressFromLT ? "text-[#CC8448]" : "text-[#FB2121]"
                } font-semibold min-w-24`}
              >
                {getTimeProgress()} min
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center mb-2 px-4 font-sansation">
        <div className="w-full bg-[#C7C6C0] rounded-full h-2.5 mb-4 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <div
            className="bg-gradient-to-r from-[#E5A971] to-[#F3BC84] h-2.5 rounded-full"
            style={{
              width: showProgressFromLT
                ? `${
                    100 - ((minutes * 60 + seconds) * 100) / (timestamp * 60)
                  }%`
                : `${((minutes * 60 + seconds) * 100) / (timestamp * 60)}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
