import { InjectionToken, Type } from '@angular/core';
import { BlogEntryConfig } from './blog-entry.decorator';

export interface BlogEntryDefinition {
  component: Type<unknown>;
  config: BlogEntryConfig;
}

export const BLOG_ENTRIES = new InjectionToken<BlogEntryDefinition[]>('BLOG_ENTRIES', {
  factory: () => []
});
