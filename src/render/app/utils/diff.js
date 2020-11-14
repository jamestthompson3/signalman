import isObject from "lodash/isObject";
import difference from "lodash/difference";
/*
 * Diffs arrays or objects. Values being compared must be of the same type
 */
export function deepDiff(source, target) {
  if (Array.isArray(source)) {
    if (isObject(source[0])) {
      const mappedStringSource = source.map(JSON.stringify);
      const mappedStringTarget = target.map(JSON.stringify);
      return Boolean(difference(mappedStringSource, mappedStringTarget).length);
    } else {
      return Boolean(difference(source, target).length);
    }
  } else {
    return JSON.stringify(source) === JSON.stringify(target);
  }
}
