'use strict';

/* eslint "no-use-before-define": 0 */

// This script is executed after a project is created with this boilerplate.
// After execution, the script will be deleted.

const path = require('path');
const fs = require('fs');

const prjPath = __dirname;
const pkgJsonPath = path.join(prjPath, 'package.json');

function postCreate(args) {
  handleSassArgument(args);

  // Empty readme
  fs.writeFileSync(path.join(prjPath, 'README.md'), '# README\n');

  // Remove unnecessary files
  ['.travis.yml', 'yarn.lock', 'rekit.md', 'LICENSE']
    .map(f => path.join(prjPath, f))
    .forEach(file => fs.existsSync(file) && fs.unlinkSync(file));

  // Clean package.json
  const pkgJson = require(pkgJsonPath); // eslint-disable-line
  pkgJson.name = args.name;
  delete pkgJson.dependencies['codecov']; // eslint-disable-line
  delete pkgJson.scripts['codecov']; // eslint-disable-line
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '  '));
}

function handleSassArgument(args) {
  const pkgJson = require(pkgJsonPath); // eslint-disable-line
  // Handle --sass argument
  if (args.sass) {
    // Update package.json dependencies
    delete pkgJson.dependencies['less']; // eslint-disable-line
    delete pkgJson.dependencies['less-loader'];
  } else {
    delete pkgJson.dependencies['sass-loader'];
    delete pkgJson.dependencies['node-sass-chokidar'];
    // Use webpack sass-loader

    const configPath = path.join(prjPath, 'config/webpack.config.js');
    const text = fs
      .readFileSync(configPath)
      .toString()
      .replace('const sassRegex = /\\.(scss|sass)$/', 'const lessRegex = /\\.less$/')
      .replace(
        'const sassModuleRegex = /\\.module\\.(scss|sass)$/',
        'const lessModuleRegex = /\\.module\\.less$/',
      )
      .replace(/sassRegex/g, 'lessRegex')
      .replace(/sassModuleRegex/g, 'lessModuleRegex')
      .replace(/sass-loader/g, 'less-loader');
    fs.writeFileSync(configPath, text);

    // Rename css to less in rekit config
    const rekitConfigPath = path.join(prjPath, 'rekit.json');
    const rekitConfig = JSON.parse(fs.readFileSync(rekitConfigPath));
    rekitConfig.css = 'less';
    fs.writeFileSync(rekitConfigPath, JSON.stringify(rekitConfig, null, '  '));

    // Rename .scss to .less in src/index.js
    const indexJsPath = path.join(prjPath, 'src/index.js');
    const newContent = fs
      .readFileSync(indexJsPath)
      .toString()
      .replace("import './styles/index.scss';", "import './styles/index.less';");
    fs.writeFileSync(indexJsPath, newContent);

    // Rename files extension to 'less'
    ['src/features/home', 'src/features/examples', 'src/features/common', 'src/styles'].forEach(
      folder => {
        const fullFolderPath = path.join(prjPath, folder);
        fs.readdirSync(fullFolderPath).forEach(file => {
          if (/\.scss$/.test(file)) {
            const fullFilePath = path.join(fullFolderPath, file);
            fs.renameSync(fullFilePath, fullFilePath.replace(/scss$/, 'less'));
          }
        });
      },
    );
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '  '));
}

module.exports = postCreate;
