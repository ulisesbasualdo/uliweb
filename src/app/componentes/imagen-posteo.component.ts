import { Component, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ImagenService } from '../servicios/imagen.service';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-imagen-posteo',
  standalone: true,
  imports: [NgClass, SkeletonComponent],
  template: `
    <div class="contenedor-imagen">
      @if (cargando()) {
        <app-skeleton
          [ancho]="'100%'"
          [alto]="'250px'"
          [radio]="'0.5rem'">
        </app-skeleton>
      }
      <img
        [src]="urlImagenActual()"
        [alt]="textoAlternativo"
        class="imagen-posteo"
        [ngClass]="{'imagen-cargada': !cargando()}"
        (load)="onImagenCargada()"
        [style.display]="cargando() ? 'none' : 'block'"
      >
    </div>
  `,
  styles: [`
    .contenedor-imagen {
      width: 100%;
      border-radius: 0.5rem;
      overflow: hidden;
      margin-bottom: 1rem;
      min-height: 150px;
    }

    .imagen-posteo {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0.5rem;
      transition: opacity 0.3s ease;
      opacity: 0;
    }

    .imagen-cargada {
      opacity: 1;
    }
  `]
})
export class ImagenPosteoComponent implements OnInit {
  @Input() urlImagen: string = '';
  @Input() textoAlternativo: string = 'Imagen del post';

  cargando = signal(true);
  urlImagenActual = signal('');

  constructor(private imagenService: ImagenService) {}

  ngOnInit(): void {
    this.iniciarCargaImagen();
  }

  iniciarCargaImagen(): void {
    this.cargando.set(true);

    // Usar un placeholder de baja resolución mientras se carga
    this.urlImagenActual.set('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyMjIiLz48L3N2Zz4=');

    this.imagenService.cargarImagen(this.urlImagen).subscribe({
      next: (url) => {
        this.urlImagenActual.set(url);
      },
      error: () => {
        // En caso de error, usar una imagen de fallback
        this.urlImagenActual.set('https://via.placeholder.com/800x400/121212/9c27b0?text=Imagen+no+disponible');
        this.cargando.set(false);
      }
    });
  }

  onImagenCargada(): void {
    this.cargando.set(false);
  }
}
