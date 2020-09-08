import fs from "fs";
import {
  getDataDir,
  readDataFile,
  readTemplateFile,
} from "../filesystem/utils/projectDir";
import { PROMISE_STATUS } from "../constants/index";
import uniq from "lodash/uniq";
import keyBy from "lodash/keyBy";

const dataDir = getDataDir();

// TODO load state of workspace
// Chunk it somehow...
// Maybe add an event listener, then in a state machine or higher level component create a new component for each
// event emitted.
export async function handleWorkspaceRequest(event) {
  console.log("WORKSPACE REQUESTED");
  fs.readFile(`${dataDir}state.json`, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      throw new Error();
    }
    const state = JSON.parse(data.toString());
    const { displayedCards } = state;
    console.log({ displayedCards });
    const startupCards = displayedCards.map(readDataFile);
    const cardContents = await Promise.allSettled(startupCards);
    const filteredCards = cardContents
      .filter((card) => card.status !== PROMISE_STATUS.REJECTED)
      .map((promise) => promise.value);
    const templates = uniq(filteredCards.map((card) => card.viewTemplate));

    const templateContents = await Promise.allSettled(
      templates.map(readTemplateFile)
    );
    const filteredTemplates = keyBy(
      templateContents
        .filter((template) => template.status !== PROMISE_STATUS.REJECTED)
        .map((promise) => promise.value),
      "name"
    );
    event.reply("workspaceInit", {
      state,
      shown: [filteredCards, filteredTemplates],
    });
  });
}
