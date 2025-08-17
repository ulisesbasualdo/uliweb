const { writeFileSync, readdirSync, statSync } = require('fs');
const { basename, resolve, join } = require('path');

async function generateBlogIndex() {
  try {
    const blogEntriesPath = resolve(__dirname, '../src/app/pages/blog/blog-entries');
    const componentFiles = findComponentFiles(blogEntriesPath);

    console.log(`🔍 Buscando en: ${blogEntriesPath}`);
    console.log(`📁 Encontrados ${componentFiles.length} componentes`);

    let imports = '';
    let exports = '';
    const componentNames = [];

    componentFiles.forEach(file => {
      const fileName = basename(file, '.component.ts');
      const componentName = fileName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('') + 'Component';

      const relativePath = './' + file.replace(/\\/g, '/').replace('.component.ts', '.component');

      imports += `import {${componentName}} from '${relativePath}';\n`;
      componentNames.push(componentName);

      console.log(`✅ Agregado: ${componentName}`);
    });

    exports = `export {\n  ${componentNames.join(',\n  ')}\n};`;

    const content = `${imports}
${exports}`;

    const outputPath = resolve(__dirname, '../src/app/pages/blog/blog-entries', 'index.ts');
    writeFileSync(outputPath, content);
    console.log(`✅ index.ts generado en: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error generando index:', error);
  }
}

function findComponentFiles(dir, basePath = '') {
  const files = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const relativePath = basePath ? join(basePath, entry) : entry;

      if (statSync(fullPath).isDirectory()) {
        files.push(...findComponentFiles(fullPath, relativePath));
      } else if (entry.endsWith('.component.ts')) {
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.warn(`⚠️ No se pudo leer directorio: ${dir}: ${error} `);
  }

  return files;
}

if (require.main === module) {
  generateBlogIndex();
}

module.exports = { generateBlogIndex };
