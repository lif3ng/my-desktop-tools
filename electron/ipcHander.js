const { ipcMain, app, session } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const dns = require("dns");
const { getInternetValues, setInternetInfo } = require("./handlers/internet");
ipcMain.handle("internet-info", async () => {
  return await getInternetValues();
});
ipcMain.handle("internet-info-set", async (e, data) => {
  return await setInternetInfo(data);
});
ipcMain.handle("dns-get", () => dns.getServers());
ipcMain.handle("interface-get", () => os.networkInterfaces());
ipcMain.handle("translate", ({ sender }, text) => {
  sender.downloadURL(
    `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh-CN&q=${encodeURIComponent(
      text
    )}`
  );
});
ipcMain.handle("setting-get", () => {
  console.log(app.getPath("userData"));
  const configPath = path.join(
    app.getPath("userData"),
    "my-desktop-tools-config.json"
  );
  try {
    console.log(fs.stat(configPath));
  } catch (e) {
    fs.writeFileSync(configPath, "{}");
  }
});
