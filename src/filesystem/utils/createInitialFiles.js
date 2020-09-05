import fs from "fs";
import { getDataDir } from "./projectDir";

export function bootstrap() {
  const dataDir = getDataDir();

  // make sure data directory exists
  if (!fs.existsSync(dataDir)) {
    const initialConfig = {
      displayOnStartup: ["settings"],
      name: "My Switchyard",
      created: new Date(),
      modified: new Date(),
      user: "",
      modifier: "",
      title: "settings",
      viewTemplate: "configuration",
    };
    const configurationTemplate = {
      name: "configuration",
      displayFields: "all",
      labelFields: true,
    };
    const viewTemplate = {
      name: "basic-view",
      displayFields: ["text", "title", "modified", "modifier"],
      labelFields: false,
    };
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(`${dataDir}templates`);
    fs.writeFileSync(`${dataDir}/settings.json`, JSON.stringify(initialConfig));
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
