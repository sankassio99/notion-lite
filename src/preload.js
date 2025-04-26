const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getNotes: () => ipcRenderer.invoke("get-notes"),
    loadNote: (filename) => ipcRenderer.invoke("load-note", filename),
    saveNote: (note) => ipcRenderer.invoke("save-note", note),
    deleteNote: (filename) => ipcRenderer.invoke("delete-note", filename)
});