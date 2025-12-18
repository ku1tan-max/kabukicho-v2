const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Vite 개발 서버 주소 로드
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);