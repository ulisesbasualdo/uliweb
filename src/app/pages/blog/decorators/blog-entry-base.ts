import { InjectionToken, Type } from '@angular/core';
import { BlogEntryConfig } from './blog-entry.decorator';

export interface BlogEntryProvider {
  config: BlogEntryConfig;
  component: Type<unknown>;
}

export const BLOG_ENTRY_PROVIDERS = new InjectionToken<BlogEntryProvider[]>('BLOG_ENTRY_PROVIDERS');
