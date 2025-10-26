import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';
import { CodeShower } from '../../../../shared/components/code-shower/code-shower';

@BlogEntry({
  category: 'Angular',
  title: 'Cómo Crear un Blog sin Backend en Angular',
  needsWrap: true,
  date: new Date('2025-08-15'),
})
@Component({
  selector: 'app-blog-sin-backend-en-angular',
  imports: [CodeShower],
  templateUrl: './blog-sin-backend-en-angular.component.html',
  styleUrl: './blog-sin-backend-en-angular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogSinBackendEnAngularComponent {

  protected readonly decoratorCode = `export interface BlogEntryConfig {
  category: string;
  title: string;
  date: Date;
}

const BLOG_ENTRY_REGISTRY = new Map<Type<unknown>, BlogEntryConfig>();

export function BlogEntry(config: BlogEntryConfig) {
  return function <T extends Type<unknown>>(target: T): T {
    BLOG_ENTRY_REGISTRY.set(target, config);
    return target;
  };
}

export function getBlogEntryRegistry(): Map<Type<unknown>, BlogEntryConfig> {
  return BLOG_ENTRY_REGISTRY;
}`;

  protected readonly interfaceCode = `export interface IBlogEntry {
  id: number;
  title: string;
  date: Date;
  category: string | null;
  component: Type<unknown>;
}`;

  protected readonly autoRegisterCode = `import './blog-entries';`;

  protected readonly serviceCode = `import { computed, Injectable, signal } from '@angular/core';
import { IBlogEntry } from '../interfaces/i-blog-entry';
import { getBlogEntryRegistry } from '../decorators/blog-entry.decorator';

import '../auto-register';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly nextId = signal(1);
  private readonly entries = signal<IBlogEntry[]>([]);

  readonly allEntries = computed(() => this.entries().sort((a, b) => a.id - b.id));

  readonly categories = computed(() =>
    [...new Set(this.entries().map(entry => entry.category).filter(Boolean))]
  );

  readonly entriesByCategory = computed(() => {
    const grouped = new Map<string, IBlogEntry[]>();
    this.allEntries().forEach(entry => {
      const category = entry.category ?? 'Sin Categoría';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(entry);
    });
    return grouped;
  });

  constructor() {
    this.loadBlog();
  }

  public loadBlog(): void {
    this.updateEntries();
  }

  private updateEntries(): void {
    const registry = getBlogEntryRegistry();
    const blogEntries: IBlogEntry[] = [];

    registry.forEach((config, component) => {
      if (config) {
        blogEntries.push({
          id: this.getNextId(),
          title: config.title,
          date: config.date,
          category: config.category,
          component: component,
        });
      }
    });
    this.entries.set(blogEntries);
  }

  private getNextId(): number {
    const currentId = this.nextId();
    this.nextId.set(currentId + 1);
    return currentId;
  }

  getEntriesByCategory(category: string): IBlogEntry[] {
    return this.entriesByCategory().get(category) || [];
  }
}`;

  protected readonly componentCode = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'Angular',
  title: 'Mi Primera Entrada',
  date: new Date('2025-01-15'),
})
@Component({
  selector: 'app-mi-entrada',
  imports: [],
  template: \`
    <div>
      <h2>Mi Primera Entrada</h2>
      <p>Contenido increíble aquí...</p>
    </div>
  \`,
  styles: \`\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiEntradaComponent {}`;

  protected readonly indexCode = `import {EntryOneComponent} from './entry-one-component/entry-one.component';
import {EntryTwoComponent} from './entry-two-component/entry-two.component';
// 👆 Agregar aquí tu nuevo componente:
// import {MiNuevoComponent} from './mi-nuevo/mi-nuevo.component';

export {
  EntryOneComponent,
  EntryTwoComponent,
  // 👆 Y también exportarlo aquí:
  // MiNuevoComponent
};`;

  protected readonly blogComponentCode = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogService } from './services/blog.service';
import { DatePipe, NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [NgComponentOutlet, DatePipe],
  template: \`
    @if (blogService.categories().length === 0) {
      <div class="estado-vacio">
        <h2>No hay entradas de blog disponibles</h2>
        <p>Agrega componentes con el decorador @BlogEntry para verlos aquí.</p>
      </div>
    } @else {
      @for (category of blogService.categories(); track category) {
        <section class="categoria-seccion">
          <!-- <h2 class="categoria-titulo">{{ category }}</h2> -->

          @for (entry of blogService.getEntriesByCategory(category ?? ''); track entry.id) {
            <div class="posteo">
              <div class="encabezado-posteo">
                <img [src]="'img/me.png'" alt="Perfil" />
                <div>
                  <p class="nombre-posteo">Mi Nombre</p>
                  <p class="fecha-posteo">{{ entry.date | date:'dd MMMM yyyy' }}</p>
                </div>
              </div>

              <!-- <h2 class="titulo-posteo">{{ entry.title }}</h2> -->

              <div class="contenido-componente">
                @defer {
                  <ng-container [ngComponentOutlet]="entry.component"></ng-container>
                } @loading {
                  <p>Cargando contenido...</p>
                }
              </div>
            </div>
          }
        </section>
      }
    }
  \`,
  styles: \`
    .debug-info {
      background: #333;
      color: #fff;
      padding: 1rem;
      margin-bottom: 2rem;
      border-radius: 0.5rem;
      font-family: monospace;

      h3 {
        margin-top: 0;
        color: #4fc3f7;
      }

      p {
        margin: 0.5rem 0;
      }
    }

    .estado-carga, .estado-error {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      color: #fff;
      text-align: center;
    }

    .estado-error {
      color: #ff6b6b;
    }

    .debug-info .error {
      color: #ff6b6b;
      font-weight: bold;
    }

    .categoria-seccion {
      margin-bottom: 3rem;
    }

    .categoria-titulo {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #fff;
      border-bottom: 2px solid #333;
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .posteo {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #333;
    }

    .encabezado-posteo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #444;
      }

      div {
        display: flex;
        flex-direction: column;

        .nombre-posteo {
          font-weight: 600;
          margin: 0;
          color: #fff;
        }

        .fecha-posteo {
          font-size: 0.8rem;
          color: #b3b3b3;
          margin: 0;
        }
      }
    }

    .titulo-posteo {
      font-size: 1.5rem;
      margin: 0.5rem 0 1rem 0;
      color: #fff;
    }

    .contenido-componente {
      margin-top: 1rem;
    }

    .estado-vacio {
      text-align: center;
      padding: 3rem 1rem;
      color: #b3b3b3;

      h2 {
        color: #fff;
        margin-bottom: 1rem;
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  protected readonly blogService = inject(BlogService);
}`;

  protected readonly powershellCode = `param(
  [Parameter(Mandatory = $true)]
  [string]$ComponentName
)

Write-Host "Creando componente de blog: $ComponentName"

ng generate component $ComponentName --path src/app/pages/blog/blog-entries

if ($LASTEXITCODE -eq 0) {
  Write-Host "Componente creado exitosamente"
  Write-Host "Modificando archivo..."

  $componentPath = "src/app/pages/blog/blog-entries/$ComponentName/$ComponentName.component.ts"

  if (Test-Path $componentPath) {
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    $className = (($ComponentName -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join '') + 'Component'
    $title = ($ComponentName -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ' '

    # Reemplazar todo el contenido para evitar problemas
    $newContent = @"
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'General',
  title: '$title',
  date: new Date($currentDate),
})
@Component({
  selector: 'app-$ComponentName',
  imports: [],
  template: \`\`
  <p>
    Entrada de blog "$title" creada!
  </p>
  \`\`,
  styles: \`\`
  \`\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class $className {

}
"@

    $newContent | Set-Content $componentPath -Encoding UTF8

    Write-Host "Decorador agregado correctamente"
  }

  Write-Host "Actualizando indice..."
  npm run generate:blog-index

  if ($LASTEXITCODE -eq 0) {
    Write-Host "Componente creado y configurado correctamente!"
    Write-Host "Archivo creado en: $componentPath"
  }
}`;

  protected readonly javascriptCode = `const { writeFileSync, readdirSync, statSync } = require('fs');
const { basename, resolve, join } = require('path');

async function generateBlogIndex() {
  try {
    const blogEntriesPath = resolve(__dirname, '../src/app/pages/blog/blog-entries');
    const componentFiles = findComponentFiles(blogEntriesPath);

    console.log(\`🔍 Buscando en: \${blogEntriesPath}\`);
    console.log(\`📁 Encontrados \${componentFiles.length} componentes\`);

    let imports = '';
    let exports = '';
    const componentNames = [];

    componentFiles.forEach(file => {
      const fileName = basename(file, '.component.ts');
      const componentName = fileName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('') + 'Component';

      const relativePath = './' + file.replace(/\\\\/g, '/').replace('.component.ts', '.component');

      imports += \`import {\${componentName}} from '\${relativePath}';\\n\`;
      componentNames.push(componentName);

      console.log(\`✅ Agregado: \${componentName}\`);
    });

    exports = \`export {\\n  \${componentNames.join(',\\n  ')}\\n};\`;

    const content = \`\${imports}
\${exports}\`;

    const outputPath = resolve(__dirname, '../src/app/pages/blog/blog-entries', 'index.ts');
    writeFileSync(outputPath, content);
    console.log(\`✅ index.ts generado en: \${outputPath}\`);

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
    console.warn(\`⚠️ No se pudo leer directorio: \${dir}: \${error} \`);
  }

  return files;
}

if (require.main === module) {
  generateBlogIndex();
}

module.exports = { generateBlogIndex };`;

  protected readonly generatedIndexCode = `// Este archivo se actualiza automáticamente cuando se agregan nuevos componentes

import {BlogSinBackendEnAngularComponent} from './blog-sin-backend-en-angular/blog-sin-backend-en-angular.component';
import {LocalStorageAndSignalsComponent} from './local-storage-and-signals/local-storage-and-signals.component';
import {VsCodeEmojisComponent} from './vs-code-emojis/vs-code-emojis.component';
// Los decoradores se ejecutan automáticamente al importar
console.log('✅ Todos los componentes de blog cargados automáticamente');

export {
  BlogSinBackendEnAngularComponent,
  LocalStorageAndSignalsComponent,
  VsCodeEmojisComponent
};`;

  protected readonly packageJsonCode = `
  "scripts": {
    "generate:blog-component": "ng generate component",
    "generate:blog-index": "node scripts/blog-generate-index-ts.js",
    "new:blog": "powershell -ExecutionPolicy Bypass -File scripts/new-blog-component.ps1"
  }
}`;

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      console.log('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }
}

