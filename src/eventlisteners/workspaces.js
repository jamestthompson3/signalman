import uniq from "lodash/uniq";
import keyBy from "lodash/keyBy";

import {
  readDataFile,
  readTemplateFiles,
} from "../filesystem/utils/projectDir";
import { PROMISE_STATUS } from "../constants/index";
import ipc from "../ipc";

// TODO load state of workspace
// Chunk it somehow...
// Maybe add an event listener, then in a state machine or higher level component create a new component for each
// event emitted.
export async function workspaceRequest(event) {
  readDataFile("state")
    .then(async (state) => {
      const { displayedCards } = state;
      const startupCards = displayedCards.map(readDataFile);
      const cardContents = await Promise.allSettled(startupCards);
      const filteredCards = cardContents
        .filter((card) => card.status !== PROMISE_STATUS.REJECTED)
        .map((promise) => promise.value);

      const templateContents = await readTemplateFiles();
      const filteredTemplates = keyBy(
        templateContents
          .filter((template) => template.status !== PROMISE_STATUS.REJECTED)
          .map((promise) => promise.value),
        "name"
      );
      event.reply("workspace:init", {
        state,
        shown: [filteredCards, filteredTemplates],
      });
    })
    .catch(console.error);
}

// TODO better atomic data handling
export function updateGlobalState(msg) {
  ipc.config.id = "bg:state-updater";
  readDataFile("state").then((state) => {
    const updatedState = { ...state, [msg.field]: msg.value };
    writeDataFile("state", updatedState)
      .then(() => {})
      .catch((e) => ipc.of.background.emit("bg:updateError", e));
  });
}
