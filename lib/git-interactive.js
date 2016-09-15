#!/usr/bin/env node --harmony
const program = require("commander")

program
  .version("0.1.0")
  .command("add", "Stage files to be committed.")
  .command("help", "Help with git-interactive.", { noHelp: true, isDefault: true })
  .parse(process.argv)
