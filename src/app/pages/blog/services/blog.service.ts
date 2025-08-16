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

}
