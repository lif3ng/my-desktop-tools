const { ipcMain } = require("electron");
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
