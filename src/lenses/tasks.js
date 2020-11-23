import {
  writeDataFile,
  readDataDirTasks,
} from "../filesystem/utils/projectDir";

const versionTasks = {
  undefined: addInboxAndTagging,
};

/*
 * @param file: parsed JSON file
 * @returns: file
 * */
function addInboxAndTagging(file) {
  file.inbox = "personal";
  file.tags = [];
  return file;
}

// TODO figure out a way to make it less messy
export async function migrateTasks(installedVersion) {
  const files = await readDataDirTasks();
  for (const file of files) {
    switch (installedVersion) {
      case undefined: {
        for (const lens of Object.values(versionTasks)) {
          lens(file);
        }
        writeDataFile(file.id, file);
        break;
      }
      default:
        break;
    }
  }
}
