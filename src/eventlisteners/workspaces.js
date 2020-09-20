import { MESSAGES } from "../constants/bridge";

const {
  WORKSPACE_LOADED,
  SAVE_CARD,
  RELOAD_STATE,
  WORKSPACE_REMOVE_CARD,
} = MESSAGES;

async function loadWorkspace() {
  // Import only on demand
  const keyBy = require("lodash/keyBy");
  const {
    readDataFile,
    readTemplateFiles,
  } = require("../filesystem/utils/projectDir");
  const { PROMISE_STATUS } = require("../constants");

  const state = await readDataFile("state");
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
  return { state, shown: [filteredCards, filteredTemplates] };
}

export async function workspaceRequest(event) {
  const { state, shown } = await loadWorkspace();
  event.reply(WORKSPACE_LOADED, {
    state,
    shown,
  });
}

// As it currently stands, there are only a few data operations that should cause a global state update
// 0: add or remove a displayed card
// 1: change theme
// 2: rename the workspace
// 3: change user
export async function updateGlobalState({ type, data, event }) {
  const {
    readDataFile,
    writeDataFile,
  } = require("../filesystem/utils/projectDir");
  const state = await readDataFile("state");
  switch (type) {
    case SAVE_CARD: {
      const updatedState = {
        ...state,
        displayedCards: [...state.displayedCards, data.id],
      };
      await writeDataFile("state", updatedState);
      const newWorkspace = await loadWorkspace();
      event.reply(RELOAD_STATE, newWorkspace);
      break;
    }
    case WORKSPACE_REMOVE_CARD: {
      const updatedState = {
        ...state,
        displayedCards: state.displayedCards.filter((card) => card !== data),
      };
      await writeDataFile("state", updatedState);
      const newWorkspace = await loadWorkspace();
      event.reply(RELOAD_STATE, newWorkspace);
      break;
    }
    case RELOAD_STATE: {
      const newWorkspace = await loadWorkspace();
      event.reply(RELOAD_STATE, newWorkspace);
    }
    default:
      break;
  }
}
