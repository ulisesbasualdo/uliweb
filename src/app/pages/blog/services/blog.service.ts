import { computed, Injectable, signal, Type } from '@angular/core';
import { IBlogEntry } from '../interfaces/i-blog-entry';
import { BlogEntryConfig, getBlogEntryRegistry } from '../decorators/blog-entry.decorator';

// Side effect import - auto-registra todos los componentes automáticamente
import '../auto-register';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly nextId = signal(1);
  private readonly entries = signal<IBlogEntry[]>([]);

  readonly allEntries = computed<IBlogEntry[]>(() => this.entries().sort((a, b) => a.id - b.id));

  readonly categories = computed<string[]>(() => <string[]>[
    ...new Set(
      this.entries()
        .map(entry => entry.category)
        .filter(Boolean)
    ),
  ]);

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
    this.updateEntries();
  }

  private updateEntries(): void {
    const registry: Map<Type<unknown>, BlogEntryConfig> = getBlogEntryRegistry();
    const blogEntries: IBlogEntry[] = [];

    registry.forEach((config, component) => {
      if (config) {
        blogEntries.push({
          id: this.getNextId(),
          category: config.category,
          title: config.title,
          needsWrap: config.needsWrap,
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
