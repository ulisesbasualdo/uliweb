import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  imports: [],
  template: `
      <h2 class="titulo-sobre-mi">¡Hola! 👋</h2>
      <p class="descripcion-sobre-mi">
        Mi nombre es Ulises, soy desarrollador fullstack, me apasiona la programación y sobre todo el desarrollo frontend.
        A parte de la programación dicen que hay que tener una vida, en esa vida me encanta tomar clases de danza clásica y bailar tango.
      </p>
      <div class="foto-sobre-mi">
        <img src="/img/sobre-mi-2.jpg" alt="me" />
      </div>
      <p class="descripcion-adicional">
        Actualmente trabajo profesionalmente como desarrollador frontend con la tecnología Angular y brindo clases particulares del mismo
        framework para quienes quieren empezar de cero o ya tienen un conocimiento.
      </p>
      <div class="firma">Uli B.</div>
  `,
  styles: `
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
      max-width: 50%;
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
      font-size: 1rem;
      text-decoration: none;
      color: #00d0ff;
      transition: transform 0.3s ease;
    }

    .red-social:hover {
      transform: scale(1.05);
    }
  `,
})
export class AboutMeComponent {}
