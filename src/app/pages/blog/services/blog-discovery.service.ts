import { Injectable, inject } from '@angular/core';
import { BLOG_ENTRY_PROVIDERS } from '../decorators/blog-entry-base';
import { getBlogEntryRegistry } from '../decorators/blog-entry.decorator';

@Injectable({
  providedIn: 'root'
})
export class BlogDiscoveryService {
  private readonly providers = inject(BLOG_ENTRY_PROVIDERS, { optional: true }) || [];

  discoverAllEntries(): void {
    console.log(`🔍 Descubriendo ${this.providers.length} entradas vía DI`);

    // Registrar todas las entradas descubiertas
    const registry = getBlogEntryRegistry();
    this.providers.forEach(provider => {
      registry.set(provider.component, provider.config);
      console.log(`� Registrado: ${provider.config.title}`);
    });
  }
}
