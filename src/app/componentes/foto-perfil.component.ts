import { Component, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ImagenService } from '../services/imagen.service';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  imports: [NgClass, SkeletonComponent],
  template: `
    <div class="circulo-perfil-contenedor">
      @if (cargando()) {
        <app-skeleton
          [ancho]="'120px'"
          [alto]="'120px'"
          [radio]="'50%'">
        </app-skeleton>
      }
      <div
        class="circulo-perfil"
        [class.oculto]="cargando()">
        <img
          [src]="urlImagenActual()"
          [alt]="textoAlternativo"
          (load)="onImagenCargada()"
          [ngClass]="{'imagen-cargada': !cargando()}"
        >
      </div>
    </div>
  `,
  styles: [`
    .circulo-perfil-contenedor {
      width: 120px;
      height: 120px;
      position: relative;
    }

    .circulo-perfil {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #121212;
      background: #121212;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: absolute;
      top: 0;
      left: 0;
    }

    .circulo-perfil.oculto {
      opacity: 0;
    }

    .circulo-perfil:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(156, 39, 176, 0.5);
    }

    .circulo-perfil img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .imagen-cargada {
      opacity: 1 !important;
    }
  `]
})
export class FotoPerfilComponent implements OnInit {
  @Input() urlImagen: string = 'https://picsum.photos/200';
  @Input() textoAlternativo: string = 'Foto de perfil';

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
        this.urlImagenActual.set('https://via.placeholder.com/200/121212/9c27b0?text=Perfil');
        this.cargando.set(false);
      }
    });
  }

  onImagenCargada(): void {
    this.cargando.set(false);
  }
}
