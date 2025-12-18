// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 개발 중에는 Vite 서버 주소를 로드한다
  win.loadURL('http://localhost:5173'); 
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
