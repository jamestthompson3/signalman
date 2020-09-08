import ipc from "node-ipc";
import { USER } from "./constants/";

ipc.config.silent = true;
ipc.config.appspace = `signalman.${USER}`;
ipc.config.maxRetries = 4;
// Maybe bump this up ?
ipc.config.maxConnections = 1;

export default ipc;
