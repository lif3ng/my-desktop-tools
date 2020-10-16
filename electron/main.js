const { app, BrowserWindow, session } = require("electron");
require("./ipcHander");
const path = require("path");
const fs = require("fs");
let win;

// session.defaultSession.on("will-download", (event, item, webContents) => {
//   // event.preventDefault();
//   // require("request")(item.getURL(), (data) => {
//   //   require("fs").writeFileSync("/somewhere", data);
//   // });
//   item.once("done", (event, state) => {
//     if (state === "completed") {
//       const savePath = item.getSavePath();
//       console.log(savePath);
//       fs.readFile(savePath, (err, data) => {
//         const dataStr = data.toString();
//         console.log({ dataStr });
//         console.log(JSON.parse(dataStr));
//       });
//     }
//   });
// });
module.exports = (url) => {
  console.log({ app });
  app.whenReady().then(() => {
    console.log("whenReady");
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    win.loadURL(url);
    win.webContents.openDevTools();
  });
};

const willDownloadHandler = (event, item, webContents) => {
  item.setSavePath(path.join(app.getPath("temp"), `trans${+new Date()}.txt`));
  console.log("will download");
  item.on("done", (event, state) => {
    console.log("done");
    if (state === "completed") {
      const savePath = item.getSavePath();
      console.log(savePath);

      fs.readFile(savePath, (err, data) => {
        const dataStr = data.toString();
        console.log({ dataStr });

        win.webContents.send("translate-result", JSON.parse(dataStr));
      });
    }
  });
};
session.defaultSession.on("will-download", willDownloadHandler);
