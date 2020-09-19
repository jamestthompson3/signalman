import { USER } from "../constants/index";

export async function saveCard(data) {
  const { v4 } = require("uuid");
  const { writeDataFile } = require("../filesystem/utils/projectDir");
  const cardId = v4();
  const card = {
    id: cardId,
    ...data,
    created: new Date(),
    modified: new Date(),
    modifier: USER,
  };
  await writeDataFile(cardId, card);
  return card;
}

export async function updateCard(data) {
  const { writeDataFile } = require("../filesystem/utils/projectDir");
  const { id } = data;
  await writeDataFile(id, data);
  return id;
}
