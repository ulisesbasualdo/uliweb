const { writeFileSync, readdirSync, statSync } = require('fs');
const { basename, resolve, join } = require('path');

// Script para auto-generar el index.ts con todos los componentes
async function generateBlogIndex() {
  try {
    // Usar rutas absolutas para evitar problemas de working directory
    const blogEntriesPath = resolve(__dirname, 'blog-entries');
    const componentFiles = findComponentFiles(blogEntriesPath);

    console.log(`🔍 Buscando en: ${blogEntriesPath}`);
    console.log(`📁 Encontrados ${componentFiles.length} componentes`);

    let imports = '';
    let exports = '';
    const componentNames = [];

    componentFiles.forEach(file => {
      // Extraer nombre del componente del archivo
      const fileName = basename(file, '.component.ts');
      const componentName = fileName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('') + 'Component';

      // Crear ruta relativa correcta SIN la extensión .ts
      const relativePath = './' + file.replace(/\\/g, '/').replace('.component.ts', '.component');

      imports += `import ${componentName} from '${relativePath}';\n`;
      componentNames.push(componentName);

      console.log(`✅ Agregado: ${componentName}`);
    });

    exports = `export {\n  ${componentNames.join(',\n  ')}\n};`;

    const content = `// Auto-generado: imports automáticos de componentes de blog
// Este archivo se actualiza automáticamente cuando se agregan nuevos componentes

${imports}
// Los decoradores se ejecutan automáticamente al importar
console.log('✅ Todos los componentes de blog cargados automáticamente');

${exports}`;

    const outputPath = resolve(__dirname, 'blog-entries', 'index.ts');
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
        // Recursivo para subdirectorios
        files.push(...findComponentFiles(fullPath, relativePath));
      } else if (entry.endsWith('.component.ts')) {
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.warn(`⚠️ No se pudo leer directorio: ${dir}`);
  }

  return files;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateBlogIndex();
}

module.exports = { generateBlogIndex };
