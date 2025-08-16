import { Type } from '@angular/core';

/**
 * @description Este archivo disponibiliza el decorador BlogEntry
 */


export interface BlogEntryConfig {
  category: string;
  title: string;
  date: Date;
}

// Registry global que se llena automáticamente cuando se usan los decoradores
const BLOG_ENTRY_REGISTRY = new Map<Type<unknown>, BlogEntryConfig>();

// Observable registry para notificar cambios
class BlogRegistryNotifier {
  private listeners: Array<() => void> = [];

  addListener(callback: () => void): void {
    this.listeners.push(callback);
  }

  removeListener(callback: () => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notify(): void {
    this.listeners.forEach(callback => callback());
  }
}

const registryNotifier = new BlogRegistryNotifier();

export function BlogEntry(config: BlogEntryConfig) {
  return function <T extends Type<unknown>>(target: T): T {
    // Registrar inmediatamente en el registry
    BLOG_ENTRY_REGISTRY.set(target, config);

    console.log(`✅ Entrada de blog registrada: "${config.title}" en categoría "${config.category}"`);
    console.log(`📊 Registry ahora contiene ${BLOG_ENTRY_REGISTRY.size} entradas`);

    // Notificar a los listeners que hay un nuevo componente
    registryNotifier.notify();

    return target;
  };
}

export function getBlogEntryRegistry(): Map<Type<unknown>, BlogEntryConfig> {
  console.log(`🔍 getBlogEntryRegistry llamado. Registry size: ${BLOG_ENTRY_REGISTRY.size}`);
  return BLOG_ENTRY_REGISTRY;
}

export function onBlogEntryRegistered(callback: () => void): () => void {
  registryNotifier.addListener(callback);

  // Retornar función para cleanup
  return () => registryNotifier.removeListener(callback);
}
