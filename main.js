const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const fs = require('fs')
const c = require('ansi-colors');
const path = require('path')
const url = require('url')
const shell = electron.shell

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create Empty Dockerfile
try {
  const dockerfile = fs.openSync('Dockerfile', 'w')
  fs.appendFile('Dockerfile', 'FROM ubuntu' + '\n')
} catch (e) {
  console.log('Error:', e);
}


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file:',
    slashes: true
  }))

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // Deleting Dockerfile after window is closed
    
    mainWindow = null
    fs.exists('Dockerfile', function(exists) {
      if(exists) {
        console.log(c.green('File exists. Deleting now ...'));
        fs.unlink('Dockerfile');
      } else {
        console.log(c.red('File not found, so not deleting.'));
      }
    });
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "About This App"
  });

  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'about.html'),
    protocol: 'file:',
    slashes: true
  }))
}


// Menu Template
const mainMenuTemplate = [
  {},

  {
      label: "Help",
      submenu: [
        {
          label: 'About',
          click () {
            createAboutWindow();
          }, 

        },
        {
          label: 'Get Docker',
          click () {
            shell.openExternal('https://www.docker.com/community-edition')
          } 
        },
        {
          label: '3Pillar Global',
          click () {
            shell.openExternal('http://3pillarglobal.com')
          } 
        }
      ]},
];


//Dev Tools if not on production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push(
    {
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Cmd+Shift+c',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools()
          }
        },
        {
          role: 'reload'
        }
      ]
    },
  )
}
