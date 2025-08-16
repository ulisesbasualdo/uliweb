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

export function BlogEntry(config: BlogEntryConfig) {
  return function <T extends Type<unknown>>(target: T): T {
    // Registrar inmediatamente en el registry
    BLOG_ENTRY_REGISTRY.set(target, config);
    return target;
  };
}

export function getBlogEntryRegistry(): Map<Type<unknown>, BlogEntryConfig> {
  return BLOG_ENTRY_REGISTRY;
}
