const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function createProject(projectName) {
  const templatePath = path.join(__dirname, '../template');
  const targetPath = path.resolve(projectName);

  try {
    // Check if template directory exists
    if (!fs.existsSync(templatePath)) {
      throw new Error('Template directory not found. Please ensure the template is properly installed.');
    }

    console.log(chalk.blue('📁 Creating project directory...'));
    
    // Create target directory
    await fs.ensureDir(targetPath);

    console.log(chalk.blue('📋 Copying template files...'));
    
    // Copy all template files to target directory
    await fs.copy(templatePath, targetPath, {
      filter: (src) => {
        // Skip node_modules and other build artifacts
        const relativePath = path.relative(templatePath, src);
        return !relativePath.includes('node_modules') && 
               !relativePath.includes('.next') && 
               !relativePath.includes('dist') &&
               !relativePath.includes('.git');
      }
    });

    console.log(chalk.blue('✏️  Updating project configuration...'));
    
    // Update package.json with new project name
    const packageJsonPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      
      // Remove any scripts that might be specific to the template
      if (packageJson.scripts && packageJson.scripts.template) {
        delete packageJson.scripts.template;
      }
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Update README.md if it exists
    const readmePath = path.join(targetPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      let readmeContent = await fs.readFile(readmePath, 'utf8');
      
      // Replace template project name references
      readmeContent = readmeContent.replace(/# RTL Dashboard Template/g, `# ${projectName}`);
      readmeContent = readmeContent.replace(/rtl-dashboard/g, projectName);
      
      await fs.writeFile(readmePath, readmeContent);
    }

    console.log(chalk.blue('📦 Installing dependencies...'));
    
    // Install npm dependencies
    execSync('npm install', { 
      cwd: targetPath, 
      stdio: 'inherit',
      env: { ...process.env }
    });

    console.log(chalk.blue('🔧 Initializing git repository...'));
    
    // Initialize git repository
    try {
      execSync('git init', { cwd: targetPath, stdio: 'pipe' });
      execSync('git add .', { cwd: targetPath, stdio: 'pipe' });
      execSync('git commit -m "Initial commit from create-asktemp template"', { 
        cwd: targetPath, 
        stdio: 'pipe' 
      });
    } catch (gitError) {
      console.log(chalk.yellow('⚠️  Git initialization skipped (git not available)'));
    }

    return targetPath;

  } catch (error) {
    // Clean up on error
    if (fs.existsSync(targetPath)) {
      try {
        await fs.remove(targetPath);
      } catch (cleanupError) {
        console.warn(chalk.yellow('⚠️  Could not clean up project directory'));
      }
    }
    throw error;
  }
}

module.exports = { createProject };