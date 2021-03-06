const { ipcMain, app, session } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const dns = require("dns");
const { getInternetValues, setInternetInfo } = require("../handlers/internet");
const dirLoadHandler = require("../handlers/dirLoad");
const {
  dirCreate,
  demoRead,
  fileCreate,
  demoSave,
  dirLs,
} = require("../handlers/fileCreate");
ipcMain.handle("internet-info", async () => {
  return await getInternetValues();
});
ipcMain.handle("internet-info-set", async (e, data) => {
  return await setInternetInfo(data);
});
ipcMain.handle("dns-get", () => dns.getServers());
ipcMain.handle("interface-get", () => os.networkInterfaces());
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
ipcMain.handle("dir-load", (e, dir) => {
  return dirLoadHandler(dir);
});
ipcMain.handle("dir-file-load", (e, dirs) => {
  console.log({ dirs });
  const dir = path.join(...dirs);
  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files.map((f) => `${f.name}${f.isDirectory() ? "/" : ""}`);
});
ipcMain.handle("dir-create", (e, dirs) => {
  dirCreate(dirs);
});
ipcMain.handle("file-create", (e, dirs) => {
  return fileCreate(dirs);
});
ipcMain.handle("file-list", (e, dirs) => {
  console.log("file-list");
  return dirLs(dirs);
});
ipcMain.handle("demo-save", (e, dirs, data) => {
  return demoSave(dirs, data);
});
ipcMain.handle("demo-read", (e, dirs) => {
  return demoRead(dirs);
});
