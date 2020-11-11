import { createModel } from "@xstate/test";
import { eventHandlerMachine } from "./eventHandler.machine";
import { MESSAGES } from "../constants/bridge";

const {
  ADD_CARD,
  BG_GLOBAL_UPDATE,
  DELETE_CARD,
  RELOAD_STATE,
  REQUEST_WORKSPACE,
  SAVE_CARD,
  UPDATE_CARD,
  WORKSPACE_REMOVE_CARD,
  WORKSPACE_SEARCH,
} = MESSAGES;

jest.mock("fs");

const MOCK_FILE_INFO = {
  "1234.json": 'console.log("file1 contents");',
  "/path/to/file2.txt": "file2 contents",
};

beforeEach(() => {
  // Set up some mocked out file info before each test
  require("fs").__setMockFiles(MOCK_FILE_INFO);
});

const eventModel = createModel(eventHandlerMachine).withEvents({
  [ADD_CARD]: {
    exec: (ctx) => {
      console.log("asdf");
    },
  },
  [BG_GLOBAL_UPDATE]: {
    exec: (ctx) => {
      expect(ctx).toBe(1);
    },
  },
  [DELETE_CARD]: {
    exec: (ctx) => {
      expect(ctx).toBe(1);
    },
  },
  [REQUEST_WORKSPACE]: {
    exec: (ctx) => {
      expect(ctx).toBe(1);
    },
  },
  [SAVE_CARD]: {
    exec: (ctx) => {
      expect(ctx).toBe(1);
    },
  },
});

describe.skip("testing tests", () => {
  const testPlans = eventModel.getShortestPathPlans();
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          await path.test(1);
        });
      });
    });
  });

  it("should have full coverage", () => {
    return eventModel.testCoverage();
  });
});
