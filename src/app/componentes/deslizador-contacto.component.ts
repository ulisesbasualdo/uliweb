import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deslizador-contacto',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="contacto">
      <div class="deslizador">
        <button
          class="opcion"
          [class.activo]="opcionActiva() === 'email'"
          (click)="cambiarOpcion('email')">
          Email
        </button>
        <button
          class="opcion"
          [class.activo]="opcionActiva() === 'linkedin'"
          (click)="cambiarOpcion('linkedin')">
          LinkedIn
        </button>
      </div>

      <div class="contenido-opcion">
        @switch (opcionActiva()) {
          @case ('email') {
            <div class="opcion-email">
              <p>Para contacto envíame un email a <strong>ulimiramar@gmail.com</strong></p>
            </div>
          }
          @case ('linkedin') {
            <div class="opcion-linkedin">
              <p>Conéctate conmigo en LinkedIn</p>
              <button class="boton-linkedin" (click)="irALinkedin()">Ir a LinkedIn</button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .contacto {
        margin: 3rem 0;
        background-color: #1e1e1e;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .deslizador {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        width: 100%;
      }

      .opcion {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: none;
        color: #b3b3b3;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        position: relative;
        flex: 1;
        text-align: center;
        white-space: nowrap;
      }

      .opcion:hover {
        background-color: rgba(156, 39, 176, 0.1);
        color: #d9d9d9;
      }

      .opcion.activo {
        background-color: #9c27b0;
        color: white;
      }

      /* Eliminar el contorno de enfoque que aparece al hacer clic */
      .opcion:focus {
        outline: none;
      }

      /* Proporcionar un indicador visual para usuarios de teclado (accesibilidad) */
      .opcion:focus-visible {
        outline: 2px dashed rgba(156, 39, 176, 0.5);
        outline-offset: 2px;
      }

      .contenido-opcion {
        padding: 1rem 0;
      }
      @media (max-width: 500px) {
        .contenido-opcion {
          text-align: center;
        }
      }

      .opcion-email,
      .opcion-whatsapp,
      .opcion-linkedin {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 500px) {
        .opcion-email,
        .opcion-whatsapp,
        .opcion-linkedin {
          flex-direction: column;
        }
      }

      input,
      textarea {
        padding: 0.75rem;
        background-color: #2d2d2d;
        border: none;
        border-radius: 0.5rem;
        color: white;
        transition: box-shadow 0.3s ease;
      }

      input:focus,
      textarea:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.5);
      }

      .boton-enviar,
      .boton-linkedin {
        padding: 0.75rem 1.5rem;
        background-color: #9c27b0;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        align-self: flex-start;
      }
      @media (max-width: 500px) {
        .boton-enviar,
        .boton-linkedin {
          align-self: center;
        }
      }

      .boton-enviar:hover,
      .boton-linkedin:hover {
        background-color: #7b1fa2;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .contacto {
          padding: 1.25rem;
        }

        .deslizador {
          gap: 0;
          padding: 0 6px;
          justify-content: space-between;
        }

        .opcion {
          padding: 0.75rem 0.25rem;
          margin: 0 4px;
          font-size: 0.9rem;
          flex: 1;
        }
      }
    `,
  ],
})
export class DeslizadorContactoComponent {
  opcionActiva = signal<'email' | 'linkedin'>('email');

  cambiarOpcion(opcion: 'email' | 'linkedin') {
    this.opcionActiva.set(opcion);
  }

  irALinkedin() {
    // Implementar lógica para ir a LinkedIn
    window.open('https://www.linkedin.com/in/ulisesbasualdo', '_blank');
  }
}
