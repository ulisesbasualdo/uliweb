import { computed, Injectable, signal } from '@angular/core';
import { IBlogEntry } from '../interfaces/i-blog-entry';
import { getBlogEntryRegistry } from '../decorators/blog-entry.decorator';

// Side effect import - auto-registra todos los componentes automáticamente
import '../auto-register';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly nextId = signal(1);
  private readonly entries = signal<IBlogEntry[]>([]);

  private readonly isLoaded = signal(false);
  private readonly _loadingError = signal<string | null>(null);
  readonly loaded = this.isLoaded.asReadonly();
  readonly loadingError = this._loadingError.asReadonly();
  readonly loading = computed(() => !this.loaded());

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

  constructor() {}

  public async loadBlog(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.loadAllBlogComponents();
      this.updateEntries();

    } catch (error) {
      console.error('❌ Error inicializando auto-loader:', error);
    }
  }

  private updateEntries(): void {
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

  async loadAllBlogComponents(): Promise<void> {
    console.log('✅ Auto-loader: componentes ya registrados automáticamente');
    this.isLoaded.set(true);
    return Promise.resolve();
  }

}
