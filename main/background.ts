import { app, session } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  session.defaultSession.setDevicePermissionHandler((_) => true);
  session.defaultSession.setPermissionCheckHandler((_) => true);

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
  });
  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

})();

app.on('window-all-closed', () => {
  app.quit();
});
