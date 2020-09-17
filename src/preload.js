window.ipcRenderer = require("electron").ipcRenderer;
const ipc = require("./ipc");
ipc.config.id = "bg:render-updater";
// TODO figure out this... maybe just have a separate function....
// maybe just use electron IPC since I would only need background IPC for stuff like a daemon...
ipc.on = (channel, listener) => {
  console.log("CONNECTING TO: ", channel);
  ipc.connectTo("background", () => {
    console.log(channel);
    ipc.of.background.on(channel, listener);
  });
};
ipc.send = (channel, listener) =>
  ipc.connectTo("background", () => {
    ipc.of.background.emit(channel, listener);
  });

window.ipcBG = ipc;
