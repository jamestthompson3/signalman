import { readDataFile } from "../filesystem/utils/projectDir";
import { migrateTasks } from "./tasks";
import { migrateTemplates } from "./templates";
import { migrateState } from "./state";

export async function migrate() {
  const runningVersion = require("../../package.json").version;
  const state = await readDataFile("state");
  const { version: installedVersion } = state;
  if (installedVersion !== runningVersion) {
    console.log(`\nMigrating with lenses from version ${installedVersion}\n`);
    await migrateTasks(installedVersion);
    await migrateTemplates(installedVersion);
    await migrateState(state, runningVersion);
  }
}
