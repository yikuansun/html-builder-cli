#!/usr/bin/env node
const fs = require("fs");
const buildApp = require("./buildApp");

var dirnameReal = process.cwd();
buildApp(dirnameReal, JSON.parse(fs.readFileSync(dirnameReal + "/manifest.json", "utf-8")));