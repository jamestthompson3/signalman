import React from "react";
import { useService } from "@xstate/react";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_SEARCH, CLEAR_SEARCH } = MESSAGES;

import { searchDriver } from "../utils/eventMachines";

const searchService = searchDriver.init();

export function Search() {
  const [currentState] = useService(searchService);
  React.useEffect(() => {
    return () => searchDriver.stop();
  }, []);
  return (
    <>
      <form className="search-form">
        <label htmlFor="search" aria-hidden="true">
          search
        </label>
        <input
          id="search"
          type="search"
          className="searchbox"
          placeholder="/"
          onChange={(e) => {
            if (Boolean(e.target.value)) {
              searchDriver.send(WORKSPACE_SEARCH, e.target.value);
            } else {
              searchDriver.send(CLEAR_SEARCH);
            }
          }}
        />
      </form>
      {currentState.context.result.map((result) => (
        <p key={result.id || result.name}>
          {result.text} {result.modifier}
        </p>
      ))}
    </>
  );
}
