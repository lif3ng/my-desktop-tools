const { ipcRenderer, shell, clipboard } = require("electron");
const os = require("os");
window.ipcRenderer = ipcRenderer;
window.shell = shell;
window.clipboard = clipboard;
window.os_platform = os.platform();
