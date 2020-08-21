const {ipcMain} = require('electron')
const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const url = require('url')
const path = require('path')

let view;

function createWindow() {
	
	view = new BrowserWindow({
		autoHideMenuBar: false,
		width: 930,
		height: 480,
		webPreferences: {
			nodeIntegration: true
		}
	});

	view.loadURL(
		url.format ({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	
	view.webContents.openDevTools();
	
	view.on("closed", () => {
		view = null;
	});
}

ipcMain.on('asynchronous-message', (event, arg) => {
	console.log(arg);
	event.sender.send('asynchronous-reply', arg);
});

ipcMain.on('synchronous-message', (event, arg) => {
	console.log(arg);
	event.returnValue = arg;
});

app.on("browser-window-created", function(e, window) {
	window.setMenu(null);
});

app.on("window-all-closed", function() {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", function() {
	if (view === null) {
		createWindow();
	}
});

app.on("ready", createWindow);

