const admZip = require("adm-zip");
const fs = require("fs");
const { exec, execSync } = require("child_process");
const png2icons = require("png2icons");

function clearTemp(appPath) {
    if (fs.existsSync(appPath + "/.html-builder-cli-temp")) {
        fs.rmSync(appPath + "/.html-builder-cli-temp", {
            recursive: true
        });
    }
}

function addIcons(appPath, iconPath) {
    var img = fs.readFileSync(iconPath);
    png2icons.setLogger(console.log);
    var icns = png2icons.createICNS(img, png2icons.BILINEAR, 0);
    if (icns) {
        fs.writeFileSync(appPath + "/.html-builder-cli-temp/buildresources/icon.icns", icns);
        //fs.mkdirSync(appPath + "/.html-builder-cli-temp/buildresources/icons");
        //fs.copyFileSync(appPath + "/.html-builder-cli-temp/buildresources/icon.icns", appPath + "/.html-builder-cli-temp/buildresources/icons/512x512.icns");
    }
    var ico = png2icons.createICO(img, png2icons.BILINEAR, 0);
    if (ico) fs.writeFileSync(appPath + "/.html-builder-cli-temp/buildresources/icon.ico", ico);
    console.log();
}

function buildApp(appPath=process.cwd(), options={ version: "1.0.0", icon: process.cwd() + "/icon.png", indexFile: "index.html", colorScheme: "system" }) {

    clearTemp(appPath);

    var manifestData = options;
    console.log("App Metadata Received:");
    for (var key in manifestData) {
        console.log("-", key, ":", manifestData[key]);
    }
    console.log("If this data is incorrect, edit manifest.json.\n");
    
    var zip = new admZip();
    zip.addLocalFolder(appPath);
    
    fs.mkdirSync(appPath + "/.html-builder-cli-temp");
    fs.mkdirSync(appPath + "/.html-builder-cli-temp/html");
    
    zip.extractAllTo(appPath + "/.html-builder-cli-temp/html");
    
    var packageJSON = JSON.parse(fs.readFileSync(__dirname + "/template/package.json"));
    packageJSON["name"] = "my-html-app" + Math.random().toString().substring(2, 6);
    packageJSON["productName"] = manifestData.name;
    if (manifestData.desc) packageJSON["description"] = manifestData.desc;
    if (manifestData.version) packageJSON["version"] = manifestData.version;
    packageJSON["build"]["appId"] = "com.electron." + packageJSON["name"];
    fs.writeFileSync(appPath + "/.html-builder-cli-temp/package.json", JSON.stringify(packageJSON));
    
    let mainJS = fs.readFileSync(__dirname + "/template/main.js", "utf-8");
    mainJS = mainJS.replaceAll("%INDEX_FILE%", manifestData.indexFile || "index.html");
    mainJS = mainJS.replaceAll("%COLOR_SCHEME%", manifestData.colorScheme || "system");
    fs.writeFileSync(appPath + "/.html-builder-cli-temp/main.js", mainJS);
    
    console.log("Created configuration files.\n");
    
    fs.mkdirSync(appPath + "/.html-builder-cli-temp/buildresources");
    if (manifestData.icon) {
        addIcons(appPath, manifestData.icon);
    }
    else if (fs.existsSync(appPath + "/icon.png")) {
        addIcons(appPath, appPath + "/icon.png");
    }
    else {
        console.log("No icon file found!\n");
    }
    
    console.log("Building...\n");
    
    var platformArgs = "";
    for (var platform of manifestData.platforms) {
        platformArgs += " --" + platform;
    }
    var stdout = execSync(
        `cd '${appPath + "/.html-builder-cli-temp"}' && npm install && npx electron-builder ${platformArgs}`,
        {
            encoding: "utf-8"
        }
    );
        
    console.log("stdout from Electron:");
    for (var line of stdout.split("\n")) console.log(" > " + line);
    
    console.log("\nMoving files...\n");
    var zip2 = new admZip();
    zip2.addLocalFolder(appPath + "/.html-builder-cli-temp/dist");
    zip2.extractAllTo(appPath + "/html-builder_output");
    console.log("Deleting temp folder...\n");
    clearTemp(appPath);
    console.log(`Native apps successfully created!
    Location: ${appPath}/html-builder_output`);
    
    console.log();
    console.log("Thank you for using HTML Builder!");
    console.log("Submit feedback: https://github.com/yikuansun/html-builder-cli/issues");

}

module.exports = buildApp;