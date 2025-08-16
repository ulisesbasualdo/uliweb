import { ChangeDetectionStrategy, Component, inject, OnInit    } from '@angular/core';
import { BlogService } from './services/blog.service';
import { DatePipe, NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [NgComponentOutlet, DatePipe],
  template: `
    <div class="debug-info">
      <h3>🔧 Debug Info</h3>
      <p>Loading: {{ blogService.loading() }}</p>
      <p>Total entries: {{ blogService.allEntries().length }}</p>
      <p>Categories: {{ blogService.categories().length }}</p>
      <p>Categories list: {{ blogService.categories().join(', ') }}</p>
      @if (blogService.loadingError()) {
        <p class="error">Error: {{ blogService.loadingError() }}</p>
      }
    </div>

    @if (blogService.loading()) {
      <div class="estado-carga">
        <h2>🚀 Cargando entradas de blog automáticamente...</h2>
        <p>Descubriendo componentes en blog-entries...</p>
      </div>
    } @else if (blogService.loadingError()) {
      <div class="estado-error">
        <h2>❌ Error al cargar entradas</h2>
        <p>{{ blogService.loadingError() }}</p>
      </div>
    } @else if (blogService.categories().length === 0) {
      <div class="estado-vacio">
        <h2>No hay entradas de blog disponibles</h2>
        <p>Agrega componentes con el decorador @BlogEntry para verlos aquí.</p>
      </div>
    } @else {
      @for (category of blogService.categories(); track category) {
        <section class="categoria-seccion">
          <h2 class="categoria-titulo">{{ category }}</h2>

          @for (entry of blogService.getEntriesByCategory(category ?? ''); track entry.id) {
            <div class="posteo">
              <div class="encabezado-posteo">
                <img [src]="'img/me.png'" alt="Perfil" />
                <div>
                  <p class="nombre-posteo">Mi Nombre</p>
                  <p class="fecha-posteo">{{ entry.date | date:'dd MMMM yyyy' }}</p>
                </div>
              </div>

              <h2 class="titulo-posteo">{{ entry.title }}</h2>

              <div class="contenido-componente">
                @defer {
                  <ng-container [ngComponentOutlet]="entry.component"></ng-container>
                } @loading {
                  <p>Cargando contenido...</p>
                }
              </div>
            </div>
          }
        </section>
      }
    }
  `,
  styles: `
    .debug-info {
      background: #333;
      color: #fff;
      padding: 1rem;
      margin-bottom: 2rem;
      border-radius: 0.5rem;
      font-family: monospace;

      h3 {
        margin-top: 0;
        color: #4fc3f7;
      }

      p {
        margin: 0.5rem 0;
      }
    }

    .estado-carga, .estado-error {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      color: #fff;
      text-align: center;
    }

    .estado-error {
      color: #ff6b6b;
    }

    .debug-info .error {
      color: #ff6b6b;
      font-weight: bold;
    }

    .categoria-seccion {
      margin-bottom: 3rem;
    }

    .categoria-titulo {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #fff;
      border-bottom: 2px solid #333;
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

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
        border: 2px solid #444;
      }

      div {
        display: flex;
        flex-direction: column;

        .nombre-posteo {
          font-weight: 600;
          margin: 0;
          color: #fff;
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
      margin: 0.5rem 0 1rem 0;
      color: #fff;
    }

    .contenido-componente {
      margin-top: 1rem;
    }

    .estado-vacio {
      text-align: center;
      padding: 3rem 1rem;
      color: #b3b3b3;

      h2 {
        color: #fff;
        margin-bottom: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  protected readonly blogService = inject(BlogService);
  ngOnInit(): void {
    this.blogService.loadBlog();
  }

}
