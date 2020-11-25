jest.mock("../filesystem/utils/projectDir");

import {
  readDataFile,
  getDataDir,
  deleteDataFile,
  writeDataFile,
} from "../filesystem/utils/projectDir";
import { saveCard, updateCard, deleteCard, addCard } from "./cards";

describe("add Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readDataFile.mockReturnValue({
      user: "test",
      name: "Test Functions",
      cardList: ["test"],
    });
    writeDataFile.mockReturnValue(undefined);
  });

  it("adds a card to the card list", async () => {
    const cardFileName = "1234.json";
    await addCard(cardFileName);
    const appendedData = {
      user: "test",
      name: "Test Functions",
      cardList: ["1234", "test"],
    };
    expect(writeDataFile).toBeCalledWith("state", appendedData);
  });
});

describe("saveCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readDataFile.mockReturnValue({ user: "test" });
    getDataDir.mockReturnValue("");
    writeDataFile.mockReturnValue({
      id: "123",
      data: "asdf",
    });
  });
  it("generates a cardID and saves it with new card info", async () => {
    const card = await saveCard({
      text: "test",
      title: "card",
      inbox: "personal",
    });
    expect(card).toBeDefined();
    expect(card.modifier).toBe("test");
    expect(card.inbox).toBe("personal");
    const created = new Date(card.created);
    const modified = new Date(card.modified);
    expect(created.valueOf()).toBeDefined();
    expect(modified.valueOf()).toBeDefined();
    expect(writeDataFile).toBeCalledTimes(1);
    expect(readDataFile).toBeCalledTimes(1);
  });
});

describe("update Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readDataFile.mockReturnValue({ user: "test", name: "Test Updates" });
    getDataDir.mockReturnValue("");
    writeDataFile.mockReturnValue(undefined);
  });

  it("updates a card given an id", async () => {
    const data = {
      id: "1234",
      title: "write tests",
      text: "use jest to test basic functionality",
    };
    const id = await updateCard(data);
    expect(writeDataFile).toBeCalledWith("1234", data);
    expect(id).toEqual("1234");
  });

  it("updates the settings card in it's own case", async () => {
    const data = {
      id: "settings",
      name: "Mission Control",
      created: "2020-10-09T06:09:36.708Z",
      modified: "2020-10-09T06:09:36.708Z",
      user: "test",
      modifier: "System",
      title: "settings",
      viewTemplate: "configuration",
    };
    const id = await updateCard(data);
    expect(writeDataFile).toHaveBeenNthCalledWith(1, "settings", data);
    expect(writeDataFile).toHaveBeenNthCalledWith(2, "state", {
      name: "Mission Control",
      user: "test",
    });
    expect(id).toEqual("settings");
  });
});

describe("delete Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    deleteDataFile.mockReturnValue(undefined);
  });
  it("removes the card", async () => {
    await deleteCard("1234");
    expect(deleteDataFile).toBeCalledWith("1234");
    expect(deleteDataFile).toBeCalledTimes(1);
  });
});
