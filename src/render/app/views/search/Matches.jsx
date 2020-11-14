import React from "react";

function getStartStringBeginning(i, submatches) {
  return i === 0 ? 0 : submatches[i - 1].end;
}

export function Matches({ result }) {
  const submatches = result.submatches;
  const text = result.lines.text;
  return submatches.map((match, i) => {
    const startString = text.slice(
      getStartStringBeginning(i, submatches),
      submatches[i].start
    );
    const submatchString = (
      <mark className="exactMatch" key={submatches[i].start + startString}>
        {text.slice(submatches[i].start, submatches[i].end)}
      </mark>
    );
    const endString = text.slice(
      submatches[i].end,
      submatches[i + 1] ? submatches[i + 1].start : text.length
    );
    return [startString, submatchString, endString];
  });
}
