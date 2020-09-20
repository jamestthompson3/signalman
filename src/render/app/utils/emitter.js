function emitter() {
  const listeners = new Map();
  return {
    on(event, cb) {
      const callbacks = listeners.get(event);
      if (!callbacks) {
        listeners.set(event, new Set([cb]));
      } else {
        callbacks.add(cb);
      }
    },
    emit(event, ...args) {
      if (listeners.has(event)) {
        Array.from(listeners.get(event)).map((cb) => {
          cb(...args);
        });
      }
    },
    remove(event, cb) {
      if (listeners.has(event)) {
        listeners.get(event).delete(cb);
      }
    },
  };
}

export const workspaceEmitter = emitter();
