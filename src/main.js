import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from "fs-extra";
import fPath from "path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const createWindow = () => {
  const NOTES_DIR = path.join(app.getPath("home"), "my-notes");

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  
  ipcMain.handle("get-notes", async () => {
    const files = await fs.readdir(NOTES_DIR);
    return files.map((f) => f.replace(".json", ""));
  });

  ipcMain.handle("load-note", async (_, filename) => {
    const filePath = fPath.join(NOTES_DIR, `${filename}.json`);
    return await fs.readJson(filePath);
  });

  ipcMain.handle("save-note", async (_, { title, content }) => {
    const filePath = fPath.join(NOTES_DIR, `${title}.json`);
    console.log(filePath);
    await fs.writeJson(filePath, content, { spaces: 2 });
  });

  ipcMain.handle("delete-note", async (_, filename) => {
    console.log("Deleting note:", filename);
    const filePath = fPath.join(NOTES_DIR, `${filename}.json`);
    await fs.remove(filePath);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
