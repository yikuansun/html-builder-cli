#!/usr/bin/env node
const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");

var dirnameReal = process.cwd();

function clearTemp() {
    if (fs.existsSync(dirnameReal + "/html-builder-cli-temp")) {
        fs.rmSync(dirnameReal + "/html-builder-cli-temp", {
            recursive: true
        });
    }
}
clearTemp();

var manifestData = JSON.parse(fs.readFileSync(dirnameReal + "/manifest.json", "utf-8"));

var zip = new admZip();
zip.addLocalFolder(dirnameReal);

fs.mkdirSync(dirnameReal + "/html-builder-cli-temp");
fs.mkdirSync(dirnameReal + "/html-builder-cli-temp/html");

zip.extractAllTo(dirnameReal + "/html-builder-cli-temp/html");

fs.writeFileSync(dirnameReal + "/html-builder-cli-temp/package.json", JSON.stringify({
    name: "my-html-app" + Math.random().toString().substring(2, 6),
    productName: manifestData.name,
    description: manifestData.desc || "An app created with HTML Builder",
    author: {
        name: "HTML Builder (CLI)",
        url: "https://github.com/yikuansun/html-builder-cli"
    },
    version: manifestData.version || "1.0.0",
    main: "main.js",
    scripts: {
        start: "electron .",
        "build-linux": "electron-builder --linux",
        "build-darwin": "electron-builder --mac",
        "build-win32": "electron-builder --windows"
    },
    devDependencies: {
        electron: "^17.1.0",
        "electron-builder": "^22.14.5"
    },
    build: {
        appId: "com.electron.htmlapp" + Math.random().toString().substring(2, 6),
        directories: {
            buildResources: "buildresources"
        },
        mac: {
            "target": "zip"
        }
    }
}));

fs.writeFileSync(dirnameReal + "/html-builder-cli-temp/main.js", `
    const { app, BrowserWindow, nativeTheme } = require("electron");

    function createWindow () {

        const mainWindow = new BrowserWindow({
            width: 1200,
            height: 900,
            webPreferences: {
                nodeIntegration: true,
            }
        });

        mainWindow.setMenuBarVisibility(false);
        mainWindow.loadFile("html/index.html");
        mainWindow.maximize();
        nativeTheme.themeSource = "${manifestData.colorScheme || "system"}";

    }

    app.whenReady().then(() => {
        createWindow();
    });

    app.on("window-all-closed", function () { app.quit(); });
`);

fs.mkdirSync(dirnameReal + "/html-builder-cli-temp/buildresources");
if (manifestData.icon) {
    fs.copyFileSync(dirnameReal + "/" + manifestData.icon, dirnameReal + "/html-builder-cli-temp/buildresources/icon.png");
}
else if (fs.existsSync(dirnameReal + "/icon.png")) {
    fs.copyFileSync(dirnameReal + "/icon.png", dirnameReal + "/html-builder-cli-temp/buildresources/icon.png");
}