import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeslizadorContactoComponent } from './componentes/deslizador-contacto.component';
import { NavegacionTabsComponent } from './componentes/navegacion-tabs.component';
import { BlogComponent } from './pages/blog/blog.component';
import { MyServicesComponent } from "./pages/my-services/my-services.component";
import { AboutMeComponent } from "./pages/about-me/about-me.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DeslizadorContactoComponent, NavegacionTabsComponent, BlogComponent, MyServicesComponent, AboutMeComponent],
  template: `
    <div class="contenedor-principal">
      <section class="portada">
        <div class="contenedor-portada">
          <img [src]="'img/portada.png'" alt="me" class="imagen-portada" />
        </div>
        <div class="perfil">
          <div class="circulo-perfil-contenedor">
            <div class="circulo-perfil">
              <img [src]="'/img/me2.png'" alt="me" />
            </div>
          </div>
          <h1 class="nombre">Uli B.</h1>
          <p class="descripcion">Desarrollador Frontend Especializado en Angular</p>
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
    `,
  ],
})
export class AppComponent {
  title = 'uliweb';
}
