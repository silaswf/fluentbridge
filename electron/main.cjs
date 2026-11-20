const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    autoHideMenuBar: true,
    title: 'FluentBridge',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
  if (session && session.defaultSession) {
    session.defaultSession.setPermissionRequestHandler(
      (_webContents, permission, callback) => {
        const allowed = ['media', 'audioCapture', 'microphone'].includes(
          permission,
        );
        callback(allowed);
      },
    );

    if (session.defaultSession.setPermissionCheckHandler) {
      session.defaultSession.setPermissionCheckHandler(
        (_webContents, permission) => {
          return ['media', 'audioCapture', 'microphone'].includes(permission);
        },
      );
    }
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
