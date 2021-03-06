import { MESSAGES } from "../constants/bridge";

const {
  WORKSPACE_LOADED,
  SAVE_CARD,
  RELOAD_STATE,
  WORKSPACE_REMOVE_CARD,
  WORKSPACE_LOAD_ALL,
  SEARCH_RESULT,
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
  const { cardList } = state;
  const startupCards = cardList.map(readDataFile);
  const cardContents = await Promise.allSettled(startupCards);
  const cards = cardContents
    .filter((card) => card.status !== PROMISE_STATUS.REJECTED)
    .map((promise) => promise.value);
  const templateContents = await readTemplateFiles();
  const filteredTemplates = keyBy(
    templateContents
      .filter((template) => template.status !== PROMISE_STATUS.REJECTED)
      .map((promise) => promise.value),
    "name"
  );
  return {
    state,
    shown: { cards, templates: filteredTemplates },
  };
}

// TODO figure this mess out
export async function loadAllCardsInWorkspace({ data: onlyUnFinished, event }) {
  const {
    readTemplateFiles,
    readDataDir,
    readDataFile,
    writeDataFile,
  } = require("../filesystem/utils/projectDir");
  const dayjs = require("dayjs");
  const keyBy = require("lodash/keyBy");
  const { PROMISE_STATUS } = require("../constants");
  const allCards = await readDataDir();
  const filteredCards = allCards.filter(
    (card) => card.id !== "state" && card.id !== "settings"
  );
  const workspaceCards = filteredCards.filter((card) => {
    if (!card.scheduled) return true;
    return !dayjs().isSame(card.scheduled, "day");
  });

  const templateContents = await readTemplateFiles();
  const filteredTemplates = keyBy(
    templateContents
      .filter((template) => template.status !== PROMISE_STATUS.REJECTED)
      .map((promise) => promise.value),
    "name"
  );
  const state = await readDataFile("state");
  const cards = onlyUnFinished
    ? workspaceCards.filter((card) => card.status !== "done")
    : workspaceCards;
  event.reply(RELOAD_STATE, {
    state,
    shown: {
      cards,
      templates: filteredTemplates,
    },
  });
  writeDataFile("state", {
    ...state,
    cardList: cards.map((card) => card.id),
  });
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
        cardList: [...state.cardList, data.id],
      };
      await writeDataFile("state", updatedState);
      const newWorkspace = await loadWorkspace();
      event.reply(RELOAD_STATE, newWorkspace);
      break;
    }
    case WORKSPACE_REMOVE_CARD: {
      console.log("REMOVING");
      const updatedState = {
        ...state,
        cardList: state.cardList.filter((card) => card !== data),
      };
      console.log({ old: state.cardList, new: updatedState.cardList });
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

export function workspaceSearch(data, event) {
  const { getDataDir } = require("../filesystem/utils/projectDir");
  const { execFile } = require("child_process");
  const path = require("path");
  const { rgPath } = require("vscode-ripgrep");
  const binName = `rg${process.platform === "win32" ? ".exe" : ""}`;
  let rg =
    process.env !== "production"
      ? path.resolve(`node_modules/vscode-ripgrep/bin/${binName}`)
      : rgPath;

  const dataDir = getDataDir();
  // FYI, ripgrep supports a "--json" flag with really detailed info, if needed
  execFile(
    rg,
    [
      "--block-buffered",
      "--no-column",
      "--no-line-number",
      "--smart-case",
      "--color",
      "never",
      "-I",
      "--json",
      data,
      dataDir,
    ],
    (err, stdout) => {
      if (err) err;
      event.reply(SEARCH_RESULT, stdout);
    }
  );
}
