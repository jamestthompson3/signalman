export function send(channel, args) {
  if (channel.startsWith("bg:")) {
    window.ipcBG.send(channel, listener);
  } else {
    window.ipcRenderer.send(channel, args);
  }
}

export function on(channel, listener) {
  if (channel.startsWith("bg:")) {
    window.ipcBG.on(channel, listener);
  } else {
    window.ipcRenderer.on(channel, listener);
  }
}
