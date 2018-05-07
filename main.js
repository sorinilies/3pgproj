const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const exec = require('child_process').exec;
const fs = require('fs')
const gutil = require('gulp-util');
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create Empty Dockerfile
try {
  const dockerfile = fs.openSync('Dockerfile', 'w')
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
        console.log(gutil.colors.green('File exists. Deleting now ...'));
        fs.unlink('Dockerfile');
      } else {
        console.log(gutil.colors.red('File not found, so not deleting.'));
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


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Testing executing a bash cmd
function execute(command, callback) {
  exec(command, (error, stdout, stderr) => { 
      callback(stdout); 
  });
};


// Menu Template
const mainMenuTemplate = [
  {

  },

  {
      label: "File",
      submenu: [
        {
        label: 'execute',
        click(item) {
            execute('ping -c 4 8.8.8.8', (output) => {
            console.log(output);
          });
        }}, 
      ]

  },

  {
      label: "Help",
      submenu: [
        {
          label: 'About',
          click () {
            createAboutWindow();
          } 
        }]
  }
  
];


//Dev Tools if not on production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push(
    {
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    }
  )
}
