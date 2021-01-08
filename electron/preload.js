const { ipcRenderer, shell, clipboard, remote } = require("electron");
const os = require("os");
window.ipcRenderer = ipcRenderer;
window.shell = shell;
window.clipboard = clipboard;
window.os_platform = os.platform();
window.remote = remote;
