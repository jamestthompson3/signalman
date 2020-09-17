import { v4 as uuidv4 } from "uuid";

import { readDataFile, writeDataFile } from "../filesystem/utils/projectDir";
import { PROMISE_STATUS, USER } from "../constants/index";
import ipc from "../ipc";

export function saveCard(_, data) {
  ipc.config.id = "bg:save-card";
  const cardId = uuidv4();
  const card = {
    id: cardId,
    ...data,
    created: new Date(),
    modified: new Date(),
    modifier: USER,
  };
  writeDataFile(cardId, card)
    .then(() => {
      ipc.connectTo("background", () =>
        ipc.of.background.emit("bg:globalUpdate", {
          type: "CARD_SAVE",
          data: card,
        })
      );
    })
    .catch((e) => event.reply("card:saveError", e));
}

export function updateCard(event, data) {
  const { id } = data;
  writeDataFile(id, data)
    .then(() => {})
    .catch((e) => event.reply("card:updateError", e));
}
