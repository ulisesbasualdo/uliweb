import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  template: `
    <div seccion="contacto">
      <h2 class="titulo-contacto">Contáctame</h2>
      <p class="descripcion-contacto">
        Estoy disponible para nuevos proyectos y colaboraciones. No dudes en ponerte en contacto conmigo.
      </p>

      <form class="formulario-contacto">
        <input type="text" placeholder="Tu nombre" required />
        <input type="email" placeholder="Tu email" required />
        <textarea placeholder="Tu mensaje" rows="5" required></textarea>
        <button type="submit" class="boton-enviar">Enviar Mensaje</button>
      </form>
    </div>
  `,
  styles: `
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
  `,
})
export class ContactComponent {}
