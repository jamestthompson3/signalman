import uniq from "lodash/uniq";
import keyBy from "lodash/keyBy";

import {
  readDataFile,
  writeDataFile,
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

// As it currently stands, there are only a few data operations that should cause a global state update
// 0: add or remove a displayed card
// 1: change theme
// 2: rename the workspace
// 3: change user
export function updateGlobalState(msg) {
  console.log({ msg });
  ipc.config.id = "bg:state-updater";
  readDataFile("state").then((state) => {
    switch (msg.type) {
      case "CARD_SAVE": {
        const updatedState = {
          ...state,
          displayedCards: [...state.displayedCards, msg.data.id],
        };
        writeDataFile("state", updatedState)
          .then(() => {
            ipc.of.background.emit("bg:reloadState", updatedState);
          })
          .catch((e) => ipc.of.background.emit("bg:updateError", e));
        break;
      }
      default:
        break;
    }
  });
}
