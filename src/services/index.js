import { MESSAGES } from "../constants/bridge";
import ipc from "../ipc";

function checkScheduled(webContents) {
  const { getDataDir, readFile } = require("../filesystem/utils/projectDir");
  const { readdir } = require("fs");
  const dataDir = getDataDir();
  readdir(dataDir, { withFileTypes: true }, async (err, files) => {
    if (err) {
      console.err(err);
    } else {
      const dayjs = require("dayjs");
      let scheduledToday = [];
      for (const file of files) {
        if (file.isFile()) {
          const contents = await readFile(`${dataDir}${file.name.toString()}`)
            .then((d) => d.toString())
            .then(JSON.parse)
            .catch(console.error);
          if (!contents.scheduled) continue;
          if (dayjs().isSame(contents.scheduled, "day")) {
            scheduledToday.push(contents);
          }
        }
        webContents.send(MESSAGES.SCHEDULED_TASKS, scheduledToday);
      }
    }
  });
}

function startWatcher(webContents) {
  const dayjs = require("dayjs");
  const dayOfYear = require("dayjs/plugin/dayOfYear");
  dayjs.extend(dayOfYear);
  let today = dayjs().dayOfYear();
  setInterval(() => {
    if (dayjs().dayOfYear() !== today) {
      checkScheduled(webContents);
      today = dayjs().dayOfYear();
    }
  }, 60000);
  ipc.config.id = "day-watcher-service";
  ipc.config.retry = 1500;
  ipc.connectTo("background", () => {
    ipc.of.background.on(MESSAGES.BG_GLOBAL_UPDATE, () => {
      checkScheduled(webContents);
    });
  });
}

export function spawnDateWatcher(webContents) {
  checkScheduled(webContents);
  startWatcher(webContents);
}
