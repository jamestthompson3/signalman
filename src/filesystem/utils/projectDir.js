// Data dir is found in the following locations:
// Linux:   /home/alice/.local/share/signalman
// Windows: C:\Users\Alice\AppData\Roaming\emojipicker\data
// macOS:   /Users/Alice/Library/Application Support/signalman
import path from "path";

export function getDataDir(app) {
  switch (process.platform) {
    case "linux":
      return path.join(app.getPath("home"), ".local/share/signalman/");
    case "darwin":
      return app.getPath("userData");
    case "win32":
      return path.join(app.getPath("userData"), "Roaming\\signalman\\data\\");
    default:
      return app.getPath("userData");
  }
}
