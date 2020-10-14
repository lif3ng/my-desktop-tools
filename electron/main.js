const { app, BrowserWindow } = require("electron");
require("./ipcHander");
const path = require("path");
let win;

module.exports = (url) => {
  console.log({ app });
  app.whenReady().then(() => {
    console.log("whenReady");
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    win.loadURL(url);
    win.webContents.openDevTools();
  });
};
