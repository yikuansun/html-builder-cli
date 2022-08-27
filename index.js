const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");

var zip = new admZip();
zip.addLocalFolder(__dirname);

fs.mkdirSync(__dirname + "/html-builder-cli-temp");
fs.mkdirSync(__dirname + "/html-builder-cli-temp/html");

zip.extractAllTo(__dirname + "/html-builder-cli-temp/html");