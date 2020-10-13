const { app, BrowserWindow } = require("electron");

let win;

module.exports = (url) => {
  console.log({ app });
  app.whenReady().then(() => {
    console.log("whenReady");
    win = new BrowserWindow();
    win.loadURL(url);
  });
};
