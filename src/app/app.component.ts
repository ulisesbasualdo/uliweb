import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavegacionTabsComponent } from './componentes/navegacion-tabs.component';
import { BlogComponent } from './pages/blog/blog.component';
import { MyServicesComponent } from './pages/my-services/my-services.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    NavegacionTabsComponent,
    BlogComponent,
    MyServicesComponent,
    AboutMeComponent,
  ],
  template: `
    <div class="contenedor-principal">
      <section class="portada">
        <div class="contenedor-portada">
          <img [src]="'img/portada.jpg'" alt="me" class="imagen-portada" />
          <div class="texto-portada">
            <h1 class="nombre">Uli B.</h1>
            <p class="descripcion">Desarrollador Fullstack especializado en Frontend con Angular</p>
          </div>
          <div class="portada-cta portada-cta--left">
            <button
              type="button"
              class="btn-contacto"
              [class.btn-contacto--copied]="isEmailCopied"
              (click)="copiarEmail()"
            >
              <span class="btn-contacto__texto">
                {{ isEmailCopied ? 'ulimiramar@gmail.com ✓' : 'ulimiramar@gmail.com' }}
              </span>
              <span class="btn-contacto__icono" aria-hidden="true">
                {{ isEmailCopied ? '' : '📋' }}
              </span>
            </button>
          </div>
          <div class="portada-cta portada-cta--right">
            <button type="button" class="btn-contacto" (click)="abrirLinkedIn()">
              <span class="btn-contacto__texto">LinkedIn</span>
            </button>
          </div>
        </div>
        <div class="perfil">
          <div class="circulo-perfil-contenedor">
            <div class="circulo-perfil">
              <img [src]="'img/me2.png'" alt="me" />
            </div>
          </div>
        </div>
      </section>
      <app-navegacion-tabs>
        <app-blog seccion="blog" />
        <app-about-me seccion="sobreMi" />
        <app-my-services seccion="servicios" />
      </app-navegacion-tabs>
    </div>
  `,
  styles: [
    `
      @use 'styles/app.scss';
      @use 'styles/foto-perfil.scss';
      @use 'styles/foto-portada.scss';

      .contenedor-portada {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .texto-portada {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 2;

        .nombre {
          color: white;
          font-size: 2rem;
          margin: 0;
          text-shadow:
            2px 2px 8px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(0, 0, 0, 0.6);
        }

        .descripcion {
          color: white;
          font-size: 1.2rem;
          margin: 0.25rem 0 0 0;
          text-shadow:
            2px 2px 6px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(0, 0, 0, 0.5);
        }
      }

      .portada-cta {
        position: absolute;
        bottom: 0.75rem;
        z-index: 3;
      }

      .portada-cta--left {
        left: 0.75rem;
      }

      .portada-cta--right {
        right: 0.75rem;
      }

      .btn-contacto {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.45rem 0.9rem;
        border-radius: 999px;
        border: 1px solid rgba(18, 19, 53, 0.67);
        background: rgba(99, 102, 241, 0.1);
        color: #ffffffff;
        font-size: 0.8rem;
        cursor: pointer;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition:
          background 0.2s ease,
          transform 0.1s ease,
          box-shadow 0.2s ease;
        white-space: nowrap;
      }

      .btn-contacto:hover {
        background: rgba(26, 27, 93, 1);
        color: #ffffffff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .btn-contacto:active {
        transform: translateY(1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      }

      .btn-contacto__texto {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .btn-contacto__icono {
        font-size: 0.9rem;
      }

      .btn-contacto--copied {
        background: rgba(26, 27, 93, 1);
        color: #22c55e;
        border-color: rgba(34, 197, 94, 0.3);
      }

      .btn-contacto--copied:hover {
        background: rgba(26, 27, 93, 1);
        color: #22c55e;
        border-color: rgba(34, 197, 94, 0.3);
      }

      @media (max-width: 700px) {
        .imagen-portada {
          height: 200px;
        }
        .texto-portada {
          top: 40%;
          .nombre {
            font-size: 1.5rem;
          }
          .descripcion {
            font-size: 1rem;
          }
        }

        .portada-cta {
          bottom: 0.5rem;
        }

        .portada-cta--left {
          left: 0.5rem;
        }

        .portada-cta--right {
          right: 0.5rem;
        }

        .btn-contacto {
          font-size: 0.7rem;
          padding: 0.35rem 0.7rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'uliweb';

  isEmailCopied = false;

  copiarEmail(): void {
    const correo = 'ulimiramar@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(correo)
        .then(() => this.marcarEmailComoCopiado())
        .catch(() => {
          this.copiarEmailFallback(correo);
          this.marcarEmailComoCopiado();
        });
    } else {
      this.copiarEmailFallback(correo);
      this.marcarEmailComoCopiado();
    }
  }

  private copiarEmailFallback(correo: string): void {
    const input = document.createElement('input');
    input.value = correo;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(input);
    }
  }

  private marcarEmailComoCopiado(): void {
    this.isEmailCopied = true;
    setTimeout(() => {
      this.isEmailCopied = false;
    }, 2000);
  }

  abrirLinkedIn(): void {
    window.open('https://www.linkedin.com/in/ulisesbasualdo', '_blank', 'noopener');
  }
}
