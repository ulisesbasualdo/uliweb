import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogAutoLoaderService {
  private readonly isLoaded = signal(false);
  private readonly loadingError = signal<string | null>(null);

  readonly loaded = this.isLoaded.asReadonly();
  readonly error = this.loadingError.asReadonly();

  async loadAllBlogComponents(): Promise<void> {
    // Los componentes ya están auto-registrados por el side effect import
    console.log('✅ Auto-loader: componentes ya registrados automáticamente');
    this.isLoaded.set(true);
    return Promise.resolve();
  }
}
