const { ipcRenderer, shell, clipboard } = require("electron");
window.ipcRenderer = ipcRenderer;
window.shell = shell;
window.clipboard = clipboard;
