import { ValueProvider } from '@angular/core';

declare global {
  interface Window {
    __BLOG_ENTRY_PROVIDERS__: ValueProvider[];
  }
}
