export function parseTimeAllotted(time) {
  switch (true) {
    case time < 15:
      return "short";
    case time >= 15 && time <= 60:
      return "medium";
    case time > 60:
      return "long";
    default:
      return undefined;
  }
}

const BASE_TIME_TICK = 15;
const BASE_HEIGHT = 15;
export function parseHeight(time) {
  return Math.round(time / BASE_TIME_TICK) * BASE_HEIGHT;
}

// 24 hours * 4 quarters * BASE_HEIGHT
const TOTAL_HEIGHT = 1440;
const HEIGHT_OFFSET = 60; // TOTAL_HEIGHT / 24 hours
export function parseDayPosition(date) {
  const d = new Date(date);
  console.log(d.getHours());
  return d.getHours() * HEIGHT_OFFSET;
}
