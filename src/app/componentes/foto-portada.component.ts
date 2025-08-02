import { Component, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ImagenService } from '../services/imagen.service';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-foto-portada',
  standalone: true,
  imports: [NgClass, SkeletonComponent],
  template: `
    <div class="contenedor-portada">
      @if (cargando()) {
        <app-skeleton
          [ancho]="'100%'"
          [alto]="'350px'"
          [radio]="'1rem'">
        </app-skeleton>
      }
      <img
        [src]="urlImagenActual()"
        [alt]="textoAlternativo"
        class="imagen-portada"
        [ngClass]="{'imagen-cargada': !cargando()}"
        (load)="onImagenCargada()"
        [style.display]="cargando() ? 'none' : 'block'"
      >
    </div>
  `,
  styles: [`
    .contenedor-portada {
      width: 100%;
      border-radius: 1rem;
      overflow: hidden;
      margin-bottom: 2rem;
      min-height: 200px;
    }

    .imagen-portada {
      width: 100%;
      height: auto;
      object-fit: cover;
      transition: transform 0.5s ease, opacity 0.3s ease;
      opacity: 0;
    }

    .imagen-cargada {
      opacity: 1;
    }

    .imagen-portada:hover {
      transform: scale(1.03);
    }
  `]
})
export class FotoPortadaComponent implements OnInit {
  @Input() urlImagen: string = 'https://picsum.photos/1200/600';
  @Input() textoAlternativo: string = 'Imagen de portada';

  cargando = signal(true);
  urlImagenActual = signal('');

  constructor(private imagenService: ImagenService) {}

  ngOnInit(): void {
    this.iniciarCargaImagen();
  }

  iniciarCargaImagen(): void {
    this.cargando.set(true);

    // Usar un placeholder de baja resolución mientras se carga (opcional)
    this.urlImagenActual.set('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyMjIiLz48L3N2Zz4=');

    this.imagenService.cargarImagen(this.urlImagen).subscribe({
      next: (url) => {
        this.urlImagenActual.set(url);
      },
      error: () => {
        // En caso de error, usar una imagen de fallback
        this.urlImagenActual.set('https://via.placeholder.com/1200x600/121212/9c27b0?text=Imagen+no+disponible');
        this.cargando.set(false);
      }
    });
  }

  onImagenCargada(): void {
    this.cargando.set(false);
  }
}
