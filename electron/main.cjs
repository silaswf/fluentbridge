const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    autoHideMenuBar: true,
    title: 'FluentBridge',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow = win;
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
}

function sendProgress(percent, status) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('fb:update-progress', { percent, status });
  }
}

function downloadFileFollowingRedirects(url, destPath, redirectsLeft = 6) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) {
      reject(new Error('Too many redirects while downloading update'));
      return;
    }
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'FluentBridge-Desktop-Updater' } },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          const nextUrl = new URL(res.headers.location, url).toString();
          downloadFileFollowingRedirects(nextUrl, destPath, redirectsLeft - 1)
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} while downloading update`));
          return;
        }

        const totalBytes = Number(res.headers['content-length'] || 0);
        let receivedBytes = 0;
        const fileStream = fs.createWriteStream(destPath);

        res.on('data', (chunk) => {
          receivedBytes += chunk.length;
          if (totalBytes > 0) {
            const pct = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
            sendProgress(pct, `Baixando instalador (${pct}%)...`);
          } else {
            sendProgress(50, 'Baixando instalador...');
          }
        });

        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => {
            sendProgress(100, 'Download concluído! Abrindo instalador...');
            resolve();
          });
        });
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => reject(err));
        });
      },
    );
    req.on('error', reject);
  });
}

ipcMain.handle('fb:open-external', async (_event, url) => {
  if (typeof url === 'string' && /^https:\/\//i.test(url)) {
    await shell.openExternal(url);
  }
});

ipcMain.handle('fb:download-and-install', async (_event, payload) => {
  const url = payload?.url;
  const version = String(payload?.version || 'latest').replace(/[^0-9A-Za-z._-]/g, '');
  if (
    typeof url !== 'string' ||
    !url.startsWith('https://github.com/silaswf/fluentbridge/releases/')
  ) {
    return { ok: false, error: 'URL de atualização não autorizada.' };
  }

  const destPath = path.join(
    app.getPath('temp'),
    `FluentBridge-Setup-${version}.exe`,
  );

  try {
    sendProgress(5, 'Conectando ao servidor de atualização...');
    await downloadFileFollowingRedirects(url, destPath);
    const child = spawn(destPath, [], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    setTimeout(() => {
      app.quit();
    }, 900);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha ao baixar atualização.',
    };
  }
});

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
