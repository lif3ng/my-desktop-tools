const { app, BrowserWindow, session } = require("electron");
const path = require("path");
require("./ipcHandler");
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("lif3ng-app", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("lif3ng-app");
}

app.on("open-url", console.log);

let win;

const url = process.argv[process.argv.length - 1];
app.whenReady().then(() => {
  console.log("whenReady");
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadURL(url);
  win.webContents.openDevTools();
});
