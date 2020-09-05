import fs from "fs";
import {
  getDataDir,
  readDataFile,
  readTemplateFile
} from "../filesystem/utils/projectDir";
import { PROMISE_STATUS } from "../constants/index";

const dataDir = getDataDir();

export async function handleWorkspaceRequest(event, arg) {
  fs.readFile(`${dataDir}settings.json`, "utf8", async (err, data) => {
    const { displayOnStartup } = JSON.parse(data.toString());
    const startupCards = displayOnStartup.map(readDataFile);
    const cardContents = await Promise.allSettled(startupCards);
    // TODO get return value of filtered files
    cardContents.filter(card => card.status !== PROMISE_STATUS.REJECTED);
    const templates = cardContents.map(card =>
      readTemplateFile(card.viewTemplate)
    );
    const templateContents = await Promise.allSettled(templates);
    templateContents.filter(
      template => template.status !== PROMISE_STATUS.REJECTED
    );
    event.reply("workspaceInit", [cardContents, templateContents]);
  });
}
