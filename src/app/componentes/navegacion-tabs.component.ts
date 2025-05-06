import { Component, signal, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

type TipoTab = 'inicio' | 'sobreMi' | 'servicios' | 'contacto';

interface Tab {
  id: TipoTab;
  nombre: string;
}

@Component({
  selector: 'app-navegacion-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tabs">
      <div class="encabezados-tabs" #tabsContainer>
        <div class="indicador-tab" [style.transform]="indicadorTransform()"></div>
        <button
          *ngFor="let tab of tabs; let i = index"
          class="tab"
          [class.activo]="tabActiva() === tab.id"
          (click)="cambiarTab(tab.id, i)"
          #tabButton>
          {{ tab.nombre }}
        </button>
      </div>

      <div class="contenido-tab">
        @switch (tabActiva()) {
          @case ('inicio') {
            <div class="tab-inicio animacion-entrada">
              <ng-content select="[seccion='inicio']"></ng-content>
            </div>
          }
          @case ('sobreMi') {
            <div class="tab-sobre-mi animacion-entrada">
              <ng-content select="[seccion='sobreMi']"></ng-content>
            </div>
          }
          @case ('servicios') {
            <div class="tab-servicios animacion-entrada">
              <ng-content select="[seccion='servicios']"></ng-content>
            </div>
          }
          @case ('contacto') {
            <div class="tab-contacto animacion-entrada">
              <ng-content select="[seccion='contacto']"></ng-content>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .tabs {
      margin: 3rem 0;
    }

    .encabezados-tabs {
      display: flex;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      position: relative;
      width: 100%;
    }

    .tab {
      padding: 0.75rem 0.5rem;
      background: transparent;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: color 0.3s ease;
      z-index: 1;
      position: relative;
      flex: 1;
      text-align: center;
      white-space: nowrap;
    }

    .tab:hover {
      color: #d9d9d9;
    }

    .tab.activo {
      color: white;
    }

    /* Eliminar el contorno de enfoque que aparece al hacer clic */
    .tab:focus {
      outline: none;
    }

    /* Proporcionar un indicador visual para usuarios de teclado (accesibilidad) */
    .tab:focus-visible {
      outline: 2px dashed rgba(156, 39, 176, 0.5);
      outline-offset: 2px;
    }

    .indicador-tab {
      position: absolute;
      height: 100%;
      border-radius: 0.5rem;
      background-color: rgba(156, 39, 176, 0.15);
      border: 2px solid #9c27b0;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
      box-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
    }

    .contenido-tab {
      background-color: #1e1e1e;
      border-radius: 1rem;
      padding: 1.5rem;
      min-height: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .animacion-entrada {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .encabezados-tabs {
        gap: 0;
        justify-content: space-between;
        width: 100%;
        overflow-x: hidden;
      }

      .tab {
        padding: 0.75rem 0.25rem;
        font-size: 0.9rem;
      }
    }

    @media (min-width: 769px) {
      .encabezados-tabs {
        gap: 1rem;
      }

      .tab {
        flex: 0 1 auto;
        padding: 0.75rem 1.5rem;
      }
    }
  `]
})
export class NavegacionTabsComponent implements AfterViewInit {
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;

  tabs: Tab[] = [
    { id: 'inicio', nombre: 'Inicio' },
    { id: 'sobreMi', nombre: 'Sobre Mí' },
    { id: 'servicios', nombre: 'Servicios' },
    { id: 'contacto', nombre: 'Contacto' }
  ];

  tabActiva = signal<TipoTab>('inicio');
  indicadorTransform = signal('translateX(0) scaleX(1)');
  tabActivaIndex = signal(0);

  ngAfterViewInit() {
    // Inicializar la posición y el tamaño del indicador
    setTimeout(() => this.actualizarIndicador(), 0);

    // Recalcular cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => this.actualizarIndicador());
  }

  cambiarTab(tab: TipoTab, index: number) {
    this.tabActiva.set(tab);
    this.tabActivaIndex.set(index);
    this.actualizarIndicador();
  }

  actualizarIndicador() {
    if (!this.tabButtons || this.tabButtons.length === 0) return;

    const tabActiva = this.tabButtons.get(this.tabActivaIndex())?.nativeElement;
    if (!tabActiva) return;

    const tabWidth = tabActiva.offsetWidth;
    const tabLeft = tabActiva.offsetLeft;

    // Actualizar la posición y tamaño del indicador
    this.indicadorTransform.set(`translateX(${tabLeft}px) scaleX(${tabWidth / 100})`);
  }
}
