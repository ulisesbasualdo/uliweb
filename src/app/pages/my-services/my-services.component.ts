import { Component } from '@angular/core';

@Component({
  selector: 'app-my-services',
  imports: [],
  template: `
    <div seccion="servicios">
      <h2 class="titulo-servicios">Mis Servicios</h2>
      <div class="lista-servicios">
        <div class="servicio">
          <div class="icono-servicio">💻</div>
          <h3 class="titulo-servicio">Desarrollo Web</h3>
          <p class="descripcion-servicio">
            Desarrollo de sitios web modernos y responsive con las últimas tecnologías del mercado.
          </p>
        </div>

        <div class="servicio">
          <div class="icono-servicio">🎨</div>
          <h3 class="titulo-servicio">Diseño UX/UI</h3>
          <p class="descripcion-servicio">
            Diseño de interfaces intuitivas y atractivas centradas en la experiencia del usuario.
          </p>
        </div>

        <div class="servicio">
          <div class="icono-servicio">📱    </div>
          <h3 class="titulo-servicio">Desarrollo Móvil</h3>
          <p class="descripcion-servicio">Aplicaciones móviles nativas y cross-platform para iOS y Android.</p>
        </div>
      </div>
    </div>
  `,
  styles: `
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
    @media (max-width: 768px) {
      .lista-servicios {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class MyServicesComponent {}
