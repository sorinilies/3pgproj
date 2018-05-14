const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const exec = require('child_process').exec;
const fs = require('fs')
const path = require('path')

// Append or remove lines based on checkbox states
function appendToFile (elm) {
    if (elm.checked) {
        appendToDockerfile(elm.id);
        console.log('appended package to dockerfile')
    }
    else {
        removeLastLine();
        console.log('removed package from dockerfile')
    }
};


// Remove last line in dockefile when checkbox unchecked
function removeLastLine () {
    util = require('util'),
    cp = require('child_process');
    let command = util.format('tail -n 1 Dockerfile');

    cp.exec(command, (err, stdout, stderr) => {
        if (err) throw err;
        let to_vanquish = stdout.length;
        fs.stat('Dockerfile', (err, stats) => {
            if (err) throw err;
            fs.truncate('Dockerfile', stats.size - to_vanquish, (err) => {
                if (err) throw err;
                console.log('File truncated!');
            })
        });
    });
}


// Appending install package commands to dockerfile
function appendToDockerfile (id) {
        let package = eval('Resources.' + String(id))
        fs.append/File('Dockerfile', package + '\n', function (err) {
        if (err) throw err;
        console.log('added package! ' + id);
      });
}

// Package install commands
let Resources = {
    robot: "pip install robotframework",
    selenium: "pip install selenium",
    pytest: "pip install pytest",
    paramiko: "pip install paramiko"
}


// Build button event -> modal
const buildButton = document.getElementById('build')

buildButton.addEventListener('click', function(event) {
    if (isDockerInstalled()) {
        console.log('deploying')
    }

    // else {const modalPath = path.join('file://', __dirname, 'modal.html')
    // let win = new BrowserWindow({ frame: false, alwaysOnTop: true, modal: true, width: 400, height: 200})
    // win.on('close', function() { win = null })
    // win.loadURL(modalPath)
    // win.show()}
})

function isDockerInstalled() {
    execute('which docker', (output) => {
        if (output === "") {
            console.log('Docker not installed')
            return false
        }
        else {
            execute('docker --version | grep "Docker version"', (output) => {console.log(output)})
            if (output != "") {
                return true
            }
        }   

    })
}


// Raise container function
function raiseContainer () {

}


// Execute a bash cmd
function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error !== null) {
            console.log(`exec error: ${error}`);
        } 
        callback(stdout);
    })
}
