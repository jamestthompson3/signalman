import { writeDataFile } from "../filesystem/utils/projectDir";
import { viewTemplate } from "../filesystem/utils/createInitialFiles";

const versionTemplates = {
  undefined: addInboxAndTagging,
};

async function addInboxAndTagging() {
  await writeDataFile("templates/basic-view", viewTemplate);
}

export async function migrateTemplates(installedVersion) {
  switch (installedVersion) {
    case undefined: {
      for (const lens of Object.values(versionTemplates)) {
        await lens();
      }
      break;
    }
    default:
      break;
  }
}
