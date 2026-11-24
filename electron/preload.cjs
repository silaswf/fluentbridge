const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fluentBridgeDesktop', {
  isElectron: true,
  downloadAndInstallUpdate: (url, version) =>
    ipcRenderer.invoke('fb:download-and-install', { url, version }),
  openExternal: (url) => ipcRenderer.invoke('fb:open-external', url),
  onUpdateProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('fb:update-progress', listener);
    return () => ipcRenderer.removeListener('fb:update-progress', listener);
  },
});
