/* global rekit */
'use strict';

/* eslint "no-use-before-define": 0 */

// This script is executed after a project is created with this boilerplate.
// After execution, the script will be deleted.

const path = require('path');
const fs = require('fs');

const prjDir = __dirname;
const pkgJsonPath = path.join(prjDir, 'package.json');

function postCreate(args) {
  handleSassArgument(args);

  // Empty readme
  fs.writeFileSync(path.join(prjDir, 'README.md'), '# README\n');

  // Remove unnecessary files
  ['.travis.yml', 'yarn.lock', 'rekit.md', 'LICENSE']
    .map(f => path.join(prjDir, f))
    .forEach(file => fs.existsSync(file) && fs.unlinkSync(file));

  // Clean package.json
  const pkgJson = require(pkgJsonPath); // eslint-disable-line
  pkgJson.name = args.name;
  delete pkgJson.dependencies['codecov']; // eslint-disable-line
  delete pkgJson.scripts['codecov']; // eslint-disable-line
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '  '));

  // Remove examples code if necessary
  if (!args.examples && args.examples === 'false') {
    try {
      // rekit.core.paths.setProjectRoot(prjDir);
      // rekit.core.handleCommand({
      //   commandName: 'remove',
      //   type: 'feature',
      //   name: 'examples',
      // });
      // rekit.core.vio.flush();
    } catch (err) {
      // rekit.core.logger.warn('Failed to remove examples feature.', err);
    }
  }
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

    const configPath = path.join(prjDir, 'config/webpack.config.js');
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
    const rekitConfigPath = path.join(prjDir, 'rekit.json');
    const rekitConfig = JSON.parse(fs.readFileSync(rekitConfigPath));
    rekitConfig.css = 'less';
    fs.writeFileSync(rekitConfigPath, JSON.stringify(rekitConfig, null, '  '));

    // Rename .scss to .less in src/index.js
    const indexJsPath = path.join(prjDir, 'src/index.js');
    const newContent = fs
      .readFileSync(indexJsPath)
      .toString()
      .replace("import './styles/index.scss';", "import './styles/index.less';");
    fs.writeFileSync(indexJsPath, newContent);

    // Rename files extension to 'less'
    ['src/features/home', 'src/features/examples', 'src/features/common', 'src/styles'].forEach(
      folder => {
        const fullFolderPath = path.join(prjDir, folder);
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
