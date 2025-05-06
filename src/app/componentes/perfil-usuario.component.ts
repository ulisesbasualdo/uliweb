import { Component, Input } from '@angular/core';
import { FotoPerfilComponent } from './foto-perfil.component';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [FotoPerfilComponent],
  template: `
    <div class="perfil">
      <app-foto-perfil [urlImagen]="urlImagenPerfil" [textoAlternativo]="textoAlternativoPerfil"></app-foto-perfil>
      <h1 class="nombre">{{ nombre }}</h1>
      <p class="descripcion">{{ descripcion }}</p>
    </div>
  `,
  styles: [`
    .perfil {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      margin-top: -5rem;
    }

    .nombre {
      margin: 1rem 0 0.5rem;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      transition: color 0.3s ease;
    }

    .nombre:hover {
      color: #9c27b0;
    }

    .descripcion {
      font-size: 1.1rem;
      color: #b3b3b3;
      max-width: 500px;
      line-height: 1.6;
    }
  `]
})
export class PerfilUsuarioComponent {
  @Input() urlImagenPerfil: string = 'https://picsum.photos/200';
  @Input() textoAlternativoPerfil: string = 'Foto de perfil';
  @Input() nombre: string = 'Mi Nombre';
  @Input() descripcion: string = 'Breve descripción profesional que luego editaré';
}
