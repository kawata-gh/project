import { defineConfig } from "vite";
import { resolve } from 'path';

import fs from 'fs';
import path from 'path';

const files = [];
function readDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      if (item === 'components') continue;

      readDirectory(itemPath);
    } else {
      if (path.extname(itemPath) !== '.html') continue;

      let name;
      if (dirPath === path.resolve(__dirname, 'src')) {
        name = path.parse(itemPath).name;
      } else {
        const relativePath = path.relative(path.resolve(__dirname, 'src'), dirPath);
        const dirName = relativePath.replace(/\//g, '_');
        name = `${dirName}_${path.parse(itemPath).name}`;
      }

      const relativePath = path.relative(path.resolve(__dirname, 'src'), itemPath);
      const filePath = `/${relativePath}`;

      files.push({ name, path: filePath });
    }
  }
}
readDirectory(path.resolve(__dirname, 'src'));
const inputFiles = {};
for (const file of files){
    inputFiles[file.name] = resolve(__dirname, `./src${file.path}`);
}

export default defineConfig({
    root: './src',
    build: {
        minify: false,
        outDir: '../dist',
        PublicDir: 'public',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.')[1];
                    if(/png|jpg|svg|gif/i.test(extType)) extType = 'img';
                    if(extType === 'css') return `common/css/style.css`;
                    return `common/${extType}/[name].[ext]`;
                },
                chunkFileNames: 'common/js/[name].js',
                entryFileNames: 'common/js/[name].js'
            },
            input: inputFiles
        }
    }
})