#!/usr/bin/env node
const fs = require("fs");
const buildApp = require("./buildApp");

var dirnameReal = process.cwd();
var manifestData = JSON.parse(fs.readFileSync(dirnameReal + "/manifest.json", "utf-8"));
if (manifestData.icon) manifestData.icon = dirnameReal + "/" + manifestData.icon;
buildApp(dirnameReal, manifestData);