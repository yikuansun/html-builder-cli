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

if (!fs.existsSync(dirnameReal + "/manifest.json")) throw "Could not find manifest.json.";
var manifestData = JSON.parse(fs.readFileSync(dirnameReal + "/manifest.json", "utf-8"));
console.log("App Metadata Recieved:");
for (var key in manifestData) {
    console.log("-", key, ":", manifestData[key]);
}
console.log("If this data is incorrect, edit manifest.json.\n");

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
        start: "electron ."
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
            target: "zip"
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
        mainWindow.loadFile("html/${manifestData.indexFile || "index.html"}");
        mainWindow.maximize();
        nativeTheme.themeSource = "${manifestData.colorScheme || "system"}";

    }

    app.whenReady().then(() => {
        createWindow();
    });

    app.on("window-all-closed", function () { app.quit(); });
`);

console.log("Created configuration files.\n");

fs.mkdirSync(dirnameReal + "/html-builder-cli-temp/buildresources");
if (manifestData.icon) {
    fs.copyFileSync(dirnameReal + "/" + manifestData.icon, dirnameReal + "/html-builder-cli-temp/buildresources/icon.png");
}
else if (fs.existsSync(dirnameReal + "/icon.png")) {
    fs.copyFileSync(dirnameReal + "/icon.png", dirnameReal + "/html-builder-cli-temp/buildresources/icon.png");
}
else {
    console.log("No icon file found!\n");
}

console.log("Building...\n");

var platformArgs = "";
for (var platform of manifestData.platforms) {
    platformArgs += " --" + platform;
}
exec(`cd '${dirnameReal + "/html-builder-cli-temp"}' && npm install && npx electron-builder ${platformArgs}`, function(error, stdout, stderr) {
    if (error) console.log(error.message);
    
    console.log("stdout from Electron:");
    for (var line of stdout.split("\n")) console.log(" > " + line);

    console.log("\nMoving files...\n");
    fs.renameSync(dirnameReal + "/html-builder-cli-temp/dist", dirnameReal + "/html-builder_output");
    console.log("Deleting temp folder...\n");
    fs.rmSync(dirnameReal + "/html-builder-cli-temp", { recursive: true });
    console.log("Native apps successfully created!\nLocation: ./html-builder_output\n");

    console.log();
    console.log("Thank you for using HTML Builder!");
    console.log("Submit feedback: https://github.com/yikuansun/html-builder-cli/issues");
});