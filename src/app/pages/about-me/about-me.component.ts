import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  imports: [],
  template: `
      <h2 class="titulo-sobre-mi">¡Hola! 👋</h2>
      <p class="descripcion-sobre-mi">
        Aquí va una descripción sobre mí, mi experiencia, mis intereses y lo que me apasiona. Me dedico al desarrollo
        web y diseño de interfaces desde hace varios años.
      </p>
      <div class="foto-sobre-mi">
        <img src="/img/me.png" alt="me" />
        <p class="leyenda-foto">Una imagen vale más que mil palabras</p>
      </div>
      <p class="descripcion-adicional">
        Más información sobre mí y mi trayectoria profesional. Me especializo en crear aplicaciones web modernas con
        enfoque en la experiencia de usuario y la accesibilidad.
      </p>
      <div class="firma">Mi Firma</div>
      <div class="redes-sociales">
        <a href="#" class="red-social">📱</a>
        <a href="#" class="red-social">📘</a>
        <a href="#" class="red-social">📸</a>
        <a href="#" class="red-social">🐦</a>
      </div>
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
  `,
})
export class AboutMeComponent {}
