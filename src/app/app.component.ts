import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

// Importamos nuestros componentes personalizados
import { FotoPortadaComponent } from './componentes/foto-portada.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario.component';
import { DeslizadorContactoComponent } from './componentes/deslizador-contacto.component';
import { NavegacionTabsComponent } from './componentes/navegacion-tabs.component';
import { ImagenPosteoComponent } from './componentes/imagen-posteo.component';
import { BlogComponent } from './pages/blog/blog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    FotoPortadaComponent,
    PerfilUsuarioComponent,
    DeslizadorContactoComponent,
    NavegacionTabsComponent,
    ImagenPosteoComponent,
    BlogComponent,
  ],
  template: `
    <div class="contenedor-principal">
      <!-- Sección de portada -->
      <section class="portada">
        <app-foto-portada
          urlImagen="https://picsum.photos/1200/600"
          textoAlternativo="Imagen de portada"
        >
        </app-foto-portada>

        <app-perfil-usuario
          urlImagenPerfil="https://picsum.photos/200"
          textoAlternativoPerfil="Mi foto de perfil"
          nombre="Uli B."
          descripcion="Desarrollador web especializado en Angular"
        >
        </app-perfil-usuario>
      </section>

      <!-- Deslizador de contacto -->
      <app-deslizador-contacto></app-deslizador-contacto>

      <!-- Sección de tabs -->
      <app-navegacion-tabs>
        <!-- Contenido del blog -->
        <app-blog seccion="inicio" />

        <!-- Contenido de la sección sobre mí -->
        <div seccion="sobreMi">
          <h2 class="titulo-sobre-mi">¡Hola! 👋</h2>
          <p class="descripcion-sobre-mi">
            Aquí va una descripción sobre mí, mi experiencia, mis intereses y lo
            que me apasiona. Me dedico al desarrollo web y diseño de interfaces
            desde hace varios años.
          </p>
          <div class="foto-sobre-mi">
            <app-imagen-posteo
              urlImagen="https://picsum.photos/400/300"
              textoAlternativo="Foto personal"
            >
            </app-imagen-posteo>
            <p class="leyenda-foto">Una imagen vale más que mil palabras</p>
          </div>
          <p class="descripcion-adicional">
            Más información sobre mí y mi trayectoria profesional. Me
            especializo en crear aplicaciones web modernas con enfoque en la
            experiencia de usuario y la accesibilidad.
          </p>
          <div class="firma">Mi Firma</div>

          <div class="redes-sociales">
            <a href="#" class="red-social">📱</a>
            <a href="#" class="red-social">📘</a>
            <a href="#" class="red-social">📸</a>
            <a href="#" class="red-social">🐦</a>
          </div>
        </div>

        <!-- Contenido de la sección de servicios -->
        <div seccion="servicios">
          <h2 class="titulo-servicios">Mis Servicios</h2>
          <div class="lista-servicios">
            <div class="servicio">
              <div class="icono-servicio">💻</div>
              <h3 class="titulo-servicio">Desarrollo Web</h3>
              <p class="descripcion-servicio">
                Desarrollo de sitios web modernos y responsive con las últimas
                tecnologías del mercado.
              </p>
            </div>

            <div class="servicio">
              <div class="icono-servicio">🎨</div>
              <h3 class="titulo-servicio">Diseño UX/UI</h3>
              <p class="descripcion-servicio">
                Diseño de interfaces intuitivas y atractivas centradas en la
                experiencia del usuario.
              </p>
            </div>

            <div class="servicio">
              <div class="icono-servicio">📱</div>
              <h3 class="titulo-servicio">Desarrollo Móvil</h3>
              <p class="descripcion-servicio">
                Aplicaciones móviles nativas y cross-platform para iOS y
                Android.
              </p>
            </div>
          </div>
        </div>

        <!-- Contenido de la sección de contacto -->
        <div seccion="contacto">
          <h2 class="titulo-contacto">Contáctame</h2>
          <p class="descripcion-contacto">
            Estoy disponible para nuevos proyectos y colaboraciones. No dudes en
            ponerte en contacto conmigo.
          </p>

          <form class="formulario-contacto">
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu email" required />
            <textarea placeholder="Tu mensaje" rows="5" required></textarea>
            <button type="submit" class="boton-enviar">Enviar Mensaje</button>
          </form>
        </div>
      </app-navegacion-tabs>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: #121212;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
      }

      .contenedor-principal {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      /* Estilos de portada */
      .portada {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 0;
      }

      /* Estilos de la sección sobre mí */
      .titulo-sobre-mi {
        font-size: 2rem;
        margin-bottom: 1rem;
        text-align: center;
      }

      .descripcion-sobre-mi,
      .descripcion-adicional {
        line-height: 1.6;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .foto-sobre-mi {
        margin: 2rem 0;
        text-align: center;
      }

      .foto-sobre-mi img {
        max-width: 100%;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .leyenda-foto {
        font-style: italic;
        color: #b3b3b3;
      }

      .firma {
        font-family: 'Dancing Script', cursive;
        font-size: 2rem;
        margin: 2rem 0;
        text-align: center;
      }

      .redes-sociales {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .red-social {
        font-size: 1.5rem;
        text-decoration: none;
        color: white;
        transition: transform 0.3s ease;
      }

      .red-social:hover {
        transform: scale(1.2);
      }

      /* Estilos de la sección de servicios */
      .titulo-servicios {
        text-align: center;
        margin-bottom: 2rem;
      }

      .lista-servicios {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .servicio {
        text-align: center;
        padding: 1.5rem;
        background-color: #2d2d2d;
        border-radius: 0.5rem;
        transition: transform 0.3s ease;
      }

      .servicio:hover {
        transform: translateY(-5px);
      }

      .icono-servicio {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .titulo-servicio {
        margin-bottom: 0.5rem;
      }

      .descripcion-servicio {
        color: #b3b3b3;
      }

      /* Estilos de la sección de contacto */
      .titulo-contacto {
        margin-bottom: 1rem;
        text-align: center;
      }

      .descripcion-contacto {
        margin-bottom: 2rem;
        text-align: center;
      }

      .formulario-contacto {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 500px;
        margin: 0 auto;
      }

      .boton-enviar {
        padding: 0.75rem 1.5rem;
        background-color: #9c27b0;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        align-self: flex-start;
      }

      .boton-enviar:hover {
        background-color: #7b1fa2;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .contenedor-principal {
          padding: 0 0.5rem;
        }

        .lista-servicios {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'uliweb';
}
