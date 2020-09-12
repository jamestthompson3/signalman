import fs from "fs";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import { getDataDir, readDataFile } from "../filesystem/utils/projectDir";
import { PROMISE_STATUS } from "../constants/index";

const dataDir = getDataDir();

const writeFile = util.promisify(fs.writeFile);

export async function saveCard(event) {
  const cardId = uuidv4();
  const card = {
    id: id,
    ...event.data,
  };
  writeFile(`${dataDir}/${cardId}.json`, JSON.stringify(card))
    .then(() => {})
    .catch((e) => event.reply("card:saveError", e));
}

export function updateCard(event, data) {
  console.log(data);
  const { id } = data;
  writeFile(`${dataDir}/${id}.json`, JSON.stringify(data))
    .then(() => {})
    .catch((e) => event.reply("card:updateError", e));
}
