import { interpret } from "xstate";
import { workspaceMachine } from "../machines/workspace-general.machine";
import { emitter } from "./emitter";

function eventDriver(machine) {
  let service;
  return {
    init(trace) {
      if (service) {
        throw new Error("driver already initialzed");
      }
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
    }
  };
}

export const workspaceDriver = eventDriver(workspaceMachine);
