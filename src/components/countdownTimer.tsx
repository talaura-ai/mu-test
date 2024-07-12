import React from "react";
import { useTimer } from "react-timer-hook";

export default function CountdownTimer ({
  timestamp,
  onTimeout,
}: any) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60 * timestamp);
  const { seconds, minutes, hours, restart, days } = useTimer({
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

  return (
    <>
      { `${days}D:${hours}H:${minutes}M` }
    </>
  );
}
