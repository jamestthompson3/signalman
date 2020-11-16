import React from "react";
import dayjs from "dayjs";

export function Timestamp({ date }) {
  const isScheduledToday = dayjs().isSame(date, "day");
  const timestring = isScheduledToday
    ? date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : date.toLocaleDateString();
  return (
    <>
      {!isScheduledToday && <p>⏰</p>}
      <time className="date-scheduled" dateTime={date}>
        {timestring}
      </time>
    </>
  );
}
