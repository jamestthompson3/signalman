import React from "react";

const HOTKEY_SLOTS = Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
export function Hotkeys() {
  return (
    <div className="hotkey-container">
      {HOTKEY_SLOTS.map((slot) => (
        <div key={slot} className="hotkey">
          <span>{slot}</span>
        </div>
      ))}
    </div>
  );
}
