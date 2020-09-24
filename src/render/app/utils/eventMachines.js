import { interpret } from "xstate";
import { workspaceMachine } from "machines/workspace-general.machine";
import { searchMachine } from "machines/search.machine";

function eventDriver(machine) {
  let service;
  return {
    init(trace) {
      if (service) {
        throw new Error("driver already initialzed");
      }
      if (trace) console.log("INITIALZING DRIVER: ", machine.id);
      service = interpret(machine).start();
      if (trace) service.onEvent(console.log);
      return service;
    },
    send(event, data) {
      if (!service) {
        throw new Error("driver is not yet initialized");
      }
      service.send({ type: event, data });
    },
    stop() {
      service.stop();
      service = undefined;
    },
  };
}

export const workspaceDriver = eventDriver(workspaceMachine);
export const searchDriver = eventDriver(searchMachine);
