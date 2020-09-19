function emitter() {
  const listeners = new Map();
  return {
    on(event, cb) {
      const callbacks = listeners.get(event);
      if (!callbacks) {
        listeners.set(event, [cb]);
      } else {
        callbacks.push(cb);
      }
    },
    emit(event, ...args) {
      (listeners.get(event) || []).map((cb) => {
        cb(...args);
      });
    },
  };
}

export const workspaceEmitter = emitter();
