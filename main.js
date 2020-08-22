const {ipcMain} = require('electron');
const {Menu} = require('electron');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const url = require('url')
const path = require('path')

ipcMain.on('asynchronous-message', (e, msg)=>{
	console.log(msg);
	e.sender.send('asynchronous-reply', msg);
});

ipcMain.on('synchronous-message', (e, msg)=>{
	console.log(msg);
	e.returnValue = msg;
});

ipcMain.handle('some-event-name', (e, msg)=>{
	console.log(msg);
	return msg;
});

let view;

function initMenu() {

	const template = [
	  { 
	    role: 'help', label: 'Help',
	    submenu: [
	      { label: 'Stolen from',
	        click () { 
	          require('electron').shell.openExternal('https://github.com/crilleengvall/electron-tutorial-app')
	        }
	      }
	    ]
	  }
	]

	if (process.platform === 'darwin') {
	  const name = app.getName()
	  template.unshift(
	    {
	      label: name,
	      submenu: [
	        { role: 'about', label: 'About' +' ' +app.getName() },
	        { type: 'separator' },
	        { role: 'quit', label: 'Quit' +' ' +app.getName() }
	      ]
	    }
	  )
	}

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}

function initView() {
	
	view = new BrowserWindow({
		width: 930,
		height: 480,
		webPreferences: {
			nodeIntegration: true
		}
	});

	view.loadURL(
		url.format ({
			pathname: path.join(__dirname, 'main.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	
	view.webContents.openDevTools();
	
	view.on('closed', () => { view = null; });
}

app.on('browser-window-created', function(e, window) {
	window.setMenu(null);
});

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	if (view === null) {
		initView();
	}
});

app.on('ready', initMenu);
app.on('ready', initView);

