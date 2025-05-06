import { Injectable } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private imageCache = new Map<string, string>();

  /**
   * Carga una imagen de forma perezosa
   * @param url URL de la imagen a cargar
   * @returns Observable que emite la URL de la imagen cuando está lista
   */
  cargarImagen(url: string): Observable<string> {
    // Si la imagen ya está en caché, retornarla inmediatamente
    if (this.imageCache.has(url)) {
      return of(this.imageCache.get(url) as string);
    }

    // Cargar la imagen
    return from(this.precargarImagen(url)).pipe(
      map(() => {
        this.imageCache.set(url, url);
        return url;
      })
    );
  }

  /**
   * Precarga una imagen
   * @param url URL de la imagen a precargar
   * @returns Promise que se resuelve cuando la imagen está cargada
   */
  private precargarImagen(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
    });
  }
}
