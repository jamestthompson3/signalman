import { v4 as uuidv4 } from "uuid";
import { readDataFile, writeDataFile } from "../filesystem/utils/projectDir";
import { PROMISE_STATUS } from "../constants/index";

export function saveCard(event) {
  const cardId = uuidv4();
  const card = {
    id: id,
    ...event.data,
  };
  writeDataFile(cardId, card)
    .then(() => {})
    .catch((e) => event.reply("card:saveError", e));
}

export function updateCard(event, data) {
  const { id } = data;
  writeDataFile(id, data)
    .then(() => {})
    .catch((e) => event.reply("card:updateError", e));
}
