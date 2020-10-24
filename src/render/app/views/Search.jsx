import React from "react";
import { useService } from "@xstate/react";
import { MESSAGES } from "global/constants/bridge";
import get from "lodash/get";
import "./search.css";
import { searchDriver, workspaceDriver } from "../utils/eventMachines";

const { WORKSPACE_SEARCH, CLEAR_SEARCH, ADD_CARD } = MESSAGES;

const searchService = searchDriver.init();
const getCardId = (text) =>
  text.split(window.pathSep).pop().split(".json").shift();

export function Search() {
  const [currentState] = useService(searchService);
  const form = React.useRef(null);
  React.useEffect(() => {
    return () => searchDriver.stop();
  }, []);
  const {
    context: { result },
  } = currentState;
  const [focused, setFocused] = React.useState(0);
  const captureFocus = (e) => {
    switch (e.which) {
      // up arrow
      case 40: {
        if (focused < result.length) {
          setFocused(focused + 1);
        }
        break;
      }
      // down arrow
      case 38: {
        if (focused !== 0) {
          setFocused(focused - 1);
        }
        break;
      }
      // enter
      case 13: {
        workspaceDriver.send(ADD_CARD, get(result, `${focused}.path.text`));
        searchDriver.send(CLEAR_SEARCH);
        break;
      }
      case 27: {
        searchDriver.send(CLEAR_SEARCH);
        break;
      }
      default:
        break;
    }
  };

  const renderTextMatches = (result) => {
    const children = [];
    const submatches = result.submatches;
    const text = result.lines.text;
    for (let i = 0; i < submatches.length; i++) {
      const startString = text.slice(
        i === 0 ? 0 : submatches[i - 1].end,
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
      children.push(startString, submatchString, endString);
    }
    return children;
  };
  return (
    <div className="search-form">
      <form
        ref={form}
        onSubmit={() => {
          workspaceDriver.send(ADD_CARD, get(result, `${focused}.id`));
        }}
      >
        <label style={{ display: "none" }} htmlFor="search" aria-hidden="true">
          search
        </label>
        <input
          id="search"
          type="search"
          className="searchbox"
          placeholder="search"
          onKeyDown={captureFocus}
          onChange={(e) => {
            if (Boolean(e.target.value)) {
              searchDriver.send(WORKSPACE_SEARCH, e.target.value);
            } else {
              searchDriver.send(CLEAR_SEARCH);
            }
          }}
        />
      </form>
      <div className="search-result-box -top">
        {result.map((result, i) => (
          <p
            tabIndex="-1"
            className={
              focused === i ? "search-result focused" : "search-result"
            }
            key={Math.random() * result.absolute_offset + i}
            onClick={() => {
              workspaceDriver.send(ADD_CARD, result.path.text);
              form.current && form.current.reset();
              searchDriver.send(CLEAR_SEARCH);
            }}
          >
            <span className="id-label">{getCardId(result.path.text)}</span>
            <br />
            {renderTextMatches(result)}
          </p>
        ))}
      </div>
    </div>
  );
}
