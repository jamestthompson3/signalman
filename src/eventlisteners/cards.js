import { v4 as uuidv4 } from "uuid";

import { writeDataFile } from "../filesystem/utils/projectDir";
import { USER } from "../constants/index";
// import {MESSAGES} from "../constants/bridge"

// const {SAVE_CARD, UPDATE_CARD} = MESSAGES

export async function saveCard(data) {
  const cardId = uuidv4();
  const card = {
    id: cardId,
    ...data,
    created: new Date(),
    modified: new Date(),
    modifier: USER,
  };
  try {
    await writeDataFile(cardId, card);
  } catch (e) {
    console.error(e);
  }
}

export async function updateCard(data) {
  const { id } = data;
  try {
    await writeDataFile(id, data);
  } catch (e) {
    console.error(e);
  }
}
