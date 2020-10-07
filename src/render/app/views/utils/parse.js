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
