import { computed, inject, Injectable, signal, Type } from '@angular/core';
import { IBlogEntry } from '../interfaces/i-blog-entry';
import { getBlogEntryRegistry, onBlogEntryRegistered } from '../decorators/blog-entry.decorator';
import { BlogAutoLoaderService } from './blog-auto-loader.service';

// Side effect import - auto-registra todos los componentes automáticamente
import '../auto-register';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly nextId = signal(1);
  private readonly entries = signal<IBlogEntry[]>([]);
  private readonly autoLoader = inject(BlogAutoLoaderService);
  private cleanupListener?: () => void;

  readonly allEntries = computed(() => this.entries().sort((a, b) => a.id - b.id));
  readonly loading = computed(() => !this.autoLoader.loaded());
  readonly loadingError = this.autoLoader.error;

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
    console.log('🚀 BlogService inicializando...');

    // Configurar listener para nuevos registros
    this.cleanupListener = onBlogEntryRegistered(() => {
      console.log('🔔 Nuevo componente registrado, actualizando entradas...');
      this.updateEntries();
    });

    console.log('👂 Listener configurado para nuevos registros');

    // Inicializar auto-loader
    this.initializeAutoLoader();
  }

  ngOnDestroy(): void {
    if (this.cleanupListener) {
      this.cleanupListener();
    }
  }

  private async initializeAutoLoader(): Promise<void> {
    try {
      console.log('📋 Estado inicial del registry:', getBlogEntryRegistry().size);

      // Esperar un momento para que el auto-registro termine
      await new Promise(resolve => setTimeout(resolve, 100));

      // Cargar todos los componentes automáticamente
      await this.autoLoader.loadAllBlogComponents();

      console.log('📋 Estado del registry después del auto-loader:', getBlogEntryRegistry().size);

      // Actualizar entradas después de la carga
      this.updateEntries();

    } catch (error) {
      console.error('❌ Error inicializando auto-loader:', error);
      // Intentar actualizar entradas aunque haya error
      this.updateEntries();
    }
  }  private updateEntries(): void {
    const registry = getBlogEntryRegistry();
    const blogEntries: IBlogEntry[] = [];

    console.log(`📊 Registry contiene ${registry.size} entradas`);

    registry.forEach((config, component) => {
      if (config) {
        blogEntries.push({
          id: this.getNextId(),
          category: config.category,
          title: config.title,
          date: config.date,
          component,
        });
      }
    });

    console.log(`✅ Entradas actualizadas: ${blogEntries.length}`);
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

  registerEntry(component: unknown, config: { category: string; title: string; date: Date }): void {
    const newEntry: IBlogEntry = {
      id: this.getNextId(),
      category: config.category,
      title: config.title,
      date: config.date,
      component: component as Type<unknown>,
    };

    this.entries.update(entries => [...entries, newEntry]);
  }
}
