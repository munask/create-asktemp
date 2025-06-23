#!/usr/bin/env node

const path = require('path');
const { createProject } = require('../src/generator');
const chalk = require('chalk');

// Get project name from command line arguments
const projectName = process.argv[2];

// Validation
if (!projectName) {
  console.error(chalk.red('❌ Error: Please provide a project name!'));
  console.log(chalk.yellow('Usage: npx create-asktemp <project-name>'));
  console.log(chalk.yellow('Example: npx create-asktemp my-dashboard'));
  process.exit(1);
}

// Validate project name format
const validName = /^[a-z0-9-_]+$/i.test(projectName);
if (!validName) {
  console.error(chalk.red('❌ Error: Project name can only contain letters, numbers, hyphens, and underscores'));
  process.exit(1);
}

// Check if directory already exists
const fs = require('fs');
if (fs.existsSync(projectName)) {
  console.error(chalk.red(`❌ Error: Directory "${projectName}" already exists!`));
  process.exit(1);
}

console.log(chalk.blue('🚀 Creating Arabic RTL Dashboard project...'));
console.log(chalk.gray(`Project name: ${projectName}`));
console.log('');

// Create the project
createProject(projectName)
  .then(() => {
    console.log('');
    console.log(chalk.green('✅ Project created successfully!'));
    console.log('');
    console.log(chalk.yellow('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  npm run dev'));
    console.log('');
    console.log(chalk.blue('Happy coding! 🎉'));
  })
  .catch((error) => {
    console.error(chalk.red('❌ Error creating project:'));
    console.error(error.message);
    process.exit(1);
  });