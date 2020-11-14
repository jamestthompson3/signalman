import React from "react";

function getStartStringBeginning(i, submatches) {
  return i === 0 ? 0 : submatches[i - 1].end;
}

export function Matches({ result }) {
  // console.log({ result });
  const submatches = result.submatches;
  const text = result.lines.text;
  return submatches.map((_, i) => {
    // get the preceeding text to the chars that match
    // add spacer text '...' in front of match
    const startString = text
      .slice(getStartStringBeginning(i, submatches), submatches[i].start)
      .slice(10, 30)
      .concat("... ");
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
