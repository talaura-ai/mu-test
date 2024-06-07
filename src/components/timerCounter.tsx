import React from "react";
import TimeLeftIcon from "../assets/svg/timeLeftIcon.svg";
import { useTimer } from 'react-timer-hook';

export default function TimerCounter ({ timestamp, title, onTimeout }: any) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60 * timestamp);
  const {
    seconds,
    minutes,
    hours,
    restart
  } = useTimer({ expiryTimestamp: time, onExpire: () => { onTimeout() } });

  React.useEffect(() => {
    if (timestamp) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60 * timestamp);
      restart(time)
    }
  }, [timestamp])

  return (
    <>
      <div className="flex md:flex-row flex-col items-center md:justify-between mb-6 font-sansation">
        <div className="flex items-center justify-start">
          <span className="font-bold text-black self-center text-2xl whitespace-nowrap md:text-[32px] ">
            { title }
          </span>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="w-full flex">
            <p className="text-[18px] text-[#FB2121] font-semibold">
              Time left
            </p>
            <img src={ TimeLeftIcon } className="px-2" alt="left icon" />
            <p className="text-[18px] text-[#FB2121] font-semibold w-20">
              { minutes }:{ seconds } min
            </p>
          </div>
        </div>
      </div>
    </>
  );
}