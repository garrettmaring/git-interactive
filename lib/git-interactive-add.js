#!/usr/bin/env node --harmony

const colors = require("colors")
const shell = require("shelljs")
const inquirer = require("inquirer")

/* Configure command */
const program = require("commander")

program
  .description("Add untracked or unstaged files.")
  .option("-s, --unstaged", "Show only unstaged files.")
  .option("-t, --untracked", "Show only untracked files.")
  .parse(process.argv)

/* Colors */
colors.setTheme({
  fileColor: "red",
  unstagedColor: "blue",
  untrackedColor: "yellow",
});

/* Configure shell */
shell.config.silent = true

/* Create prompt */
const prompt = inquirer.createPromptModule()

/* Get unstaged and untracked files. Return as array of file strings. */
const unstagedFiles = shell.exec("git ls-files -md --exclude-standard").stdout.split("\n").filter((file) => file.length > 0)
const untrackedFiles = shell.exec("git ls-files -o --exclude-standard").stdout.split("\n").filter((file) => file.length > 0)

/* Format shell output for prompt */
const formattedUnstagedFiles = unstagedFiles.map((file) => {
  return {
    name: " (Unstaged) ".unstagedColor + file.fileColor,
    value: file,
  }
})

const formattedUntrackedFiles = untrackedFiles.map((file) => {
  return {
    name: " (Untracked) ".untrackedColor + file.fileColor,
    value: file,
  }
})

/* Configure question */
const selectFilesQuestion = {
  type: "checkbox",
  name: "files",
  message: "Select files to stage",
  /* Combine untracked and unstaged files seperated by line visual */
  choices: () => {
    if (program.unstaged) {
      return formattedUnstagedFiles
    } else if (program.untracked) {
      return formattedUntrackedFiles
    } else {
    return formattedUnstagedFiles.concat([new inquirer.Separator()]).concat(formattedUntrackedFiles)
    }
  },
}

/* Starts prompt */
const add = prompt([selectFilesQuestion])
  .then((answers) => {
    const { files } = answers

    if (files.length > 0) {
      shell.exec(`git add ${files.join(" ")}`)
    } else {
      console.log("No files staged.")
    }
  })

