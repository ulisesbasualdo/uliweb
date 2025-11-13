import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeslizadorContactoComponent } from './componentes/deslizador-contacto.component';
import { NavegacionTabsComponent } from './componentes/navegacion-tabs.component';
import { BlogComponent } from './pages/blog/blog.component';
import { MyServicesComponent } from './pages/my-services/my-services.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    DeslizadorContactoComponent,
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
        </div>
        <div class="perfil">
          <div class="circulo-perfil-contenedor">
            <div class="circulo-perfil">
              <img [src]="'img/me2.png'" alt="me" />
            </div>
          </div>
        </div>
      </section>
      <app-deslizador-contacto></app-deslizador-contacto>
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
      }
    `,
  ],
})
export class AppComponent {
  title = 'uliweb';
}
