import { Component } from '@angular/core';

@Component({
  selector: 'app-my-services',
  imports: [],
  template: `
    <div seccion="servicios">
      <h2 class="titulo-servicios">Clases particulares de Angular</h2>
      <div class="lista-servicios">
        <div class="servicio">
          <div class="icono-servicio">💻</div>
          <h3 class="titulo-servicio">Clases personalizadas</h3>
          <p class="descripcion-servicio">
            Si tienes alguna duda con el código o estás trabado en algo, o bien no
            sabes cómo desarrollar alguna funcionalidad, puedes contar con mis clases
            donde te apoyaré para sacar esa feature lo más rápido posible, y sobre todo que
            entiendas lo que desarrollamos. También brindo clases para aprender desde cero Angular,
            desde el punto que no sabés ni siquiera cómo crear un proyecto o qué es Angular.
          </p>
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
