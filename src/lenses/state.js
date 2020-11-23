import { writeDataFile } from "../filesystem/utils/projectDir";

const versionState = {
  undefined: addInboxes,
};

function addInboxes(state) {
  state.inboxes = ["personal"];
  return state;
}

export async function migrateState(state, runningVersion) {
  switch (state.version) {
    case undefined: {
      const finalState = Object.values(versionState).reduce(
        (accState, lens) => lens(accState),
        state
      );
      await writeDataFile("state", { ...finalState, version: runningVersion });
    }
  }
}
