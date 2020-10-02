export async function saveCard(data) {
  const { v4 } = require("uuid");
  const {
    writeDataFile,
    readDataFile,
  } = require("../filesystem/utils/projectDir");
  const { user } = await readDataFile("state");
  const cardId = v4();
  const card = {
    id: cardId,
    ...data,
    created: new Date(),
    modified: new Date(),
    modifier: user,
  };
  await writeDataFile(cardId, card);
  return card;
}

export async function updateCard(data) {
  const {
    writeDataFile,
    readDataFile,
  } = require("../filesystem/utils/projectDir");
  const { id } = data;
  await writeDataFile(id, data);
  // special case for settings. Not great, but first pass
  if (id === "settings") {
    const { name, user } = data;
    const state = await readDataFile("state");
    const updatedState = { ...state, name, user };
    await writeDataFile("state", updatedState);
  }
  return id;
}

export async function addCard(id) {
  const {
    writeDataFile,
    readDataFile,
  } = require("../filesystem/utils/projectDir");
  const state = await readDataFile("state");
  state.cardList.splice(0, 0, id);
  await writeDataFile("state", state);
}

export async function deleteCard(id) {
  const { deleteDataFile } = require("../filesystem/utils/projectDir");
  await deleteDataFile(id);
}
