import { Component, inject } from '@angular/core';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  imports: [],
  template: `
    @if(blogService.blog.hasValue()){
    <h1>{{ blogService.blog.value() }}</h1>
    } @else if(blogService.blog.error()){
    <h1>huno un error</h1>
    } @else if (blogService.blog.isLoading()){
    <h1>cargando....</h1>
    }

    <div class="posteo">
      <div class="encabezado-posteo">
        <img
          src="https://picsum.photos/50"
          alt="Avatar"
          class="avatar-posteo"
        />
        <div class="info-posteo">
          <p class="nombre-posteo">Mi Nombre</p>
          <p class="fecha-posteo">6 Mayo 2025</p>
        </div>
      </div>
      <h2 class="titulo-posteo">Mi primer proyecto web</h2>
      <p class="descripcion-posteo">
        Aquí va la descripción del posteo que puede ser bastante larga y
        detallada sobre lo que estoy haciendo.
      </p>
      <div class="slider-posteo">
        <!-- <app-imagen-posteo
                urlImagen="https://picsum.photos/800/400"
                textoAlternativo="Imagen del proyecto">
              </app-imagen-posteo> -->
      </div>
    </div>

    <div class="posteo">
      <div class="encabezado-posteo">
        <img
          src="https://picsum.photos/50"
          alt="Avatar"
          class="avatar-posteo"
        />
        <div class="info-posteo">
          <p class="nombre-posteo">Mi Nombre</p>
          <p class="fecha-posteo">2 Mayo 2025</p>
        </div>
      </div>
      <h2 class="titulo-posteo">Aprendiendo nuevas tecnologías</h2>
      <p class="descripcion-posteo">
        Un vistazo a mi proceso de aprendizaje y los proyectos en los que estoy
        trabajando actualmente.
      </p>
      <div class="slider-posteo">
        <!-- <app-imagen-posteo
                urlImagen="https://picsum.photos/800/401"
                textoAlternativo="Tecnologías">
              </app-imagen-posteo> -->
      </div>
    </div>
  `,
  styles: ` /* Estilos de la sección de inicio (feed) */
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
    }

    .avatar-posteo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .info-posteo {
      display: flex;
      flex-direction: column;
    }

    .nombre-posteo {
      font-weight: 600;
      margin: 0;
    }

    .fecha-posteo {
      font-size: 0.8rem;
      color: #b3b3b3;
      margin: 0;
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
      width: 100%;
      border-radius: 0.5rem;
    }`,
})
export class BlogComponent {
  blogService = inject(BlogService);
}
