const { app, BrowserWindow, session } = require("electron");
const path = require("path");
require("./ipcHander");

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
