import fs from "fs";
import { getDataDir } from "./projectDir";

export const USER =
  process.env.NAME || process.env.USER || process.env.USERNAME;

// TODO rethink how cards are loaded up
// Preserve the whole state instead of just having cards at startup?
// If the state then gets loaded into memory, how and when do we flush it?
// Does each card in the state get loaded into memory, or just parsed and rendered?
// What does the state look like ?
// One thing that sucks right now is that if I load the entire state on startup, once you have a few cards initialized, then it will get super slow.
const initialState = {
  name: `${USER}'s Switchyard`,
  cardList: ["settings"],
  theme: "default",
  user: USER,
  id: "state",
};

const initialConfig = {
  id: "settings",
  name: `${USER}'s Switchyard`,
  created: new Date(),
  modified: new Date(),
  user: USER,
  modifier: "System",
  title: "settings",
  viewTemplate: "configuration",
};
const configurationTemplate = {
  name: "configuration",
  fields: {
    name: {
      type: "text",
    },
    user: {
      type: "text",
    },
  },
  labelFields: true,
};
const viewTemplate = {
  name: "basic-view",
  fields: {
    text: {
      type: "text",
    },
    timeAllotted: {
      type: "text",
    },
    status: {
      type: "enum",
      options: ["done", "not done"],
    },
    scheduled: {
      type: "date",
    },
  },
  labelFields: true,
};

export function bootstrap() {
  const dataDir = getDataDir();

  // make sure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(`${dataDir}templates`);
    fs.writeFileSync(`${dataDir}/settings.json`, JSON.stringify(initialConfig));
    fs.writeFileSync(`${dataDir}/state.json`, JSON.stringify(initialState));
    fs.writeFileSync(
      `${dataDir}templates/configuration.json`,
      JSON.stringify(configurationTemplate)
    );
    fs.writeFileSync(
      `${dataDir}templates/basic-view.json`,
      JSON.stringify(viewTemplate)
    );
  }
}
