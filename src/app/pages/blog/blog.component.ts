import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  imports: [],
  template: `
    <div seccion="inicio">
          <div class="posteo">
            <div class="encabezado-posteo">
              <img src="https://picsum.photos/50" alt="Avatar" class="avatar-posteo">
              <div class="info-posteo">
                <p class="nombre-posteo">Mi Nombre</p>
                <p class="fecha-posteo">6 Mayo 2025</p>
              </div>
            </div>
            <h2 class="titulo-posteo">Mi primer proyecto web</h2>
            <p class="descripcion-posteo">Aquí va la descripción del posteo que puede ser bastante larga y detallada sobre lo que estoy haciendo.</p>
            <div class="slider-posteo">
              <!-- <app-imagen-posteo
                urlImagen="https://picsum.photos/800/400"
                textoAlternativo="Imagen del proyecto">
              </app-imagen-posteo> -->
            </div>
          </div>

          <div class="posteo">
            <div class="encabezado-posteo">
              <img src="https://picsum.photos/50" alt="Avatar" class="avatar-posteo">
              <div class="info-posteo">
                <p class="nombre-posteo">Mi Nombre</p>
                <p class="fecha-posteo">2 Mayo 2025</p>
              </div>
            </div>
            <h2 class="titulo-posteo">Aprendiendo nuevas tecnologías</h2>
            <p class="descripcion-posteo">Un vistazo a mi proceso de aprendizaje y los proyectos en los que estoy trabajando actualmente.</p>
            <div class="slider-posteo">
              <!-- <app-imagen-posteo
                urlImagen="https://picsum.photos/800/401"
                textoAlternativo="Tecnologías">
              </app-imagen-posteo> -->
            </div>
          </div>
        </div>

  `,
  styles: ``
})
export class BlogComponent implements OnInit {

  blogService = inject(BlogService);

  ngOnInit(): void {
    this.blogService.getBlog()
  }

}
