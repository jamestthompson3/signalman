import React from "react";
import "./hotkey.css";

const HOTKEY_SLOTS = Array.of(
  { symbol: "📆", template: "titleWithDate", key: 1 },
  { symbol: "📄", template: "fullTemplate", key: 2 },
  { symbol: 3, key: 3 },
  { symbol: 4, key: 4 },
  { symbol: 5, key: 5 },
  { symbol: 6, key: 6 },
  { symbol: 7, key: 7 },
  { symbol: 8, key: 8 },
  { symbol: 9, key: 9 },
  { symbol: 0, key: 0 }
);
export function Hotkeys() {
  return (
    <div className="hotkey-container">
      {HOTKEY_SLOTS.map((slot) => (
        <div key={slot.symbol} className="hotkey">
          <span className="keycode">{slot.key}</span>
          <p>{slot.symbol}</p>
          <button className="hotkey-actions">...</button>
        </div>
      ))}
    </div>
  );
}
