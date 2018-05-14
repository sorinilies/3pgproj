const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const buildButton = document.getElementById('build')

buildButton.addEventListener('click', function(event) {
    const modalPath = path.join('file://', __dirname, 'modal.html')
    let win = new BrowserWindow({ frame: false, width: 400, height: 200})
    win.on('close', function() { win = null })
    win.loadURL(modalPath)
    wind.show()
})
