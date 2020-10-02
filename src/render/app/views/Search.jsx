import React from "react";
import { useService } from "@xstate/react";
import { MESSAGES } from "global/constants/bridge";
import get from "lodash/get";

const { WORKSPACE_SEARCH, CLEAR_SEARCH, ADD_CARD } = MESSAGES;

import { searchDriver, workspaceDriver } from "../utils/eventMachines";

const searchService = searchDriver.init();

export function Search() {
  const [currentState] = useService(searchService);
  const form = React.useRef(null);
  React.useEffect(() => {
    return () => searchDriver.stop();
  }, []);
  const [focused, setFocused] = React.useState(0);
  const captureFocus = (e) => {
    switch (e.which) {
      case 40: {
        if (focused < currentState.context.result.length) {
          setFocused(focused + 1);
        }
        break;
      }
      case 38: {
        if (focused !== 0) {
          setFocused(focused - 1);
        }
        break;
      }
      default:
        break;
    }
  };
  return (
    <>
      <form
        className="search-form"
        ref={form}
        onSubmit={() => {
          workspaceDriver.send(
            ADD_CARD,
            get(currentState, `context.result[${focused}].id`)
          );
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
      {currentState.context.result.map((result, i) => (
        <p
          tabIndex="-1"
          className={focused === i ? "search-result focused" : "search-result"}
          key={result.id || result.name}
          onClick={() => {
            workspaceDriver.send(ADD_CARD, result.id);
            form.current && form.current.reset();
            searchDriver.send(CLEAR_SEARCH);
          }}
        >
          {result.text || result.title}
        </p>
      ))}
    </>
  );
}
