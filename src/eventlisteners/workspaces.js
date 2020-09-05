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

export async function handleWorkspaceRequest(event) {
  fs.readFile(`${dataDir}settings.json`, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      throw new Error();
    }
    const { displayOnStartup } = JSON.parse(data.toString());
    const startupCards = displayOnStartup.map(readDataFile);
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
    event.reply("workspaceInit", [filteredCards, filteredTemplates]);
  });
}
