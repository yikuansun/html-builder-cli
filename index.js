#!/usr/bin/env node
const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");

var dirnameReal = process.cwd();

var zip = new admZip();
zip.addLocalFolder(dirnameReal);

fs.mkdirSync(dirnameReal + "/html-builder-cli-temp");
fs.mkdirSync(dirnameReal + "/html-builder-cli-temp/html");

zip.extractAllTo(dirnameReal + "/html-builder-cli-temp/html");