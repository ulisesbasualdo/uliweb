import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { IBlogContent } from '../../interfaces/i-blog-entry';

@Component({
  selector: 'app-blog',
  imports: [],
  template: `
    @if (blog.hasValue()) {
      @for (entry of blog.value().entries; track entry.title) {
        <div class="posteo">
          <div>
            <div class="encabezado-posteo">
              <img [src]="'img/me.png'" [alt]="" />
              <div>
                <p class="nombre-posteo">Mi Nombre</p>
                <p class="fecha-posteo">6 Mayo 2025</p>
              </div>
            </div>
            <h2 class="titulo-posteo">{{ entry.title }}</h2>
            <div class="descripcion-posteo" [innerHTML]="entry.desc"></div>
            <div class="slider-posteo">
              <img [src]="'blog-img/' + entry.img" [alt]="" />
            </div>
          </div>
        </div>
      }
    }
    @if (blog.isLoading()) {
      <h1>cargando....</h1>
    }
    @if (blog.error()) {
      <h1>hubo un error</h1>
    }
  `,
  styles: `
    /* Estilos de la sección de inicio (feed) */
    .posteo {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #333;
    }

    .encabezado-posteo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      div {
        display: flex;
        flex-direction: column;
        .nombre-posteo {
          font-weight: 600;
          margin: 0;
        }

        .fecha-posteo {
          font-size: 0.8rem;
          color: #b3b3b3;
          margin: 0;
        }
      }
    }

    .titulo-posteo {
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }

    .descripcion-posteo {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .slider-posteo img {
      width: 30%;
      border-radius: 0.5rem;
    }
  `,
})
export class BlogComponent {
  protected blog = httpResource<IBlogContent>(() => 'blog.json');
}
