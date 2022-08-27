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
            buildResources: "htmlbuilder-buildresources"
        },
        mac: {
            "target": "zip"
        }
    }
}));