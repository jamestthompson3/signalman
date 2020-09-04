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
      title: "settings"
    };
    fs.mkdirSync(dataDir);
    fs.writeFileSync(`${dataDir}/settings.json`, JSON.stringify(initialConfig));
  }
}
