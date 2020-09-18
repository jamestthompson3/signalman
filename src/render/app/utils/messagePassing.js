export function send(channel, args) {
  window.ipcRenderer.send(channel, args);
}

export function on(channel, listener) {
  window.ipcRenderer.on(channel, listener);
}

export function invoke(channel, listener) {
  window.ipcRenderer.invoke(channel, listener);
}
