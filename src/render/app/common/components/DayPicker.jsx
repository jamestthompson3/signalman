import * as React from "react";
import "./daypicker.css";

import { addDays, addMonths } from "../../utils/time";

export function DayPicker({ day, send, field }) {
  const decrementMonth = () => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: addMonths(day, -1) },
    });
  };
  const incrementMonth = () => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: addMonths(day, 1) },
    });
  };

  const decrementDay = () => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: addDays(day, -1) },
    });
  };
  const incrementDay = () => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: addDays(day, 1) },
    });
  };
  const updateDay = (value) => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: new Date(day.setDate(value)) },
    });
  };
  const setTime = (time) => {
    send({
      type: "UPDATE_FIELD",
      data: { field, value: new Date(day.setHours(...time)) },
    });
  };
  return (
    <div className="day-container">
      <div className="month">
        <button
          className="increment-decrement"
          onClick={() => {
            decrementMonth();
          }}
        >
          👈
        </button>
        <span>
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(day)}
        </span>
        <button
          className="increment-decrement"
          onClick={() => {
            incrementMonth();
          }}
        >
          👉
        </button>
      </div>
      <div className="day">
        <div className="day-modifier">
          <button
            className="increment-decrement"
            onClick={() => {
              decrementDay();
            }}
          >
            👇
          </button>
          <input
            type="text"
            className="day-input"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => updateDay(e.target.value)}
            value={day.getDate()}
          />
          <button
            className="increment-decrement"
            onClick={() => {
              incrementDay();
            }}
          >
            ☝️
          </button>
        </div>
        <input
          type="time"
          className="time-input"
          value={String.prototype.concat(day.getHours(), ":", day.getMinutes())}
          onChange={(e) => setTime(e.target.value.split(":"))}
        />
      </div>
    </div>
  );
}
