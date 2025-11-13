import { Component, computed, OnDestroy, OnInit, signal, ChangeDetectionStrategy, viewChild } from '@angular/core';

interface TilePosition {
  x: number;
  y: number;
  index: number;
}

@Component({
  selector: 'app-bg-svg',
  imports: [],
  templateUrl: './bg-svg.html',
  styleUrl: './bg-svg.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, OnDestroy {

  protected bgSvg = viewChild<SVGElement>('bgSvg');


  // espaciado entre tiles más pequeño para patrón más denso y detallista
  readonly tileSpacingX = 40;
  readonly tileSpacingY = 40;

  // dimensiones del viewport
  viewportWidth = signal(window.innerWidth);
  viewportHeight = signal(window.innerHeight);

  // viewBox que comienza desde coordenadas negativas para cubrir completamente
  viewBox = computed(() => {
    const width = this.viewportWidth();
    const height = this.viewportHeight();
    const margin = 100;
    return `${-margin} ${-margin} ${width + margin * 2} ${height + margin * 2}`;
  });

  // posiciones calculadas de todos los tiles
  tiles = computed(() => {
    const width = this.viewportWidth();
    const height = this.viewportHeight();
    const positions: TilePosition[] = [];

    // calculamos cuántas columnas y filas necesitamos (con margen extra)
    const cols = Math.ceil(width / this.tileSpacingX) + 5;
    const rows = Math.ceil(height / this.tileSpacingY) + 5;

    let index = 0;
    // Comenzamos desde -3 para asegurar cobertura completa desde el borde
    for (let row = -4; row < rows; row++) {
      for (let col = -4; col < cols; col++) {
        // pequeño offset alternado para evitar alineación perfecta
        const offsetX = (row % 2) * 10;
        const offsetY = (col % 2) * 10;

        positions.push({
          x: col * this.tileSpacingX + offsetX,
          y: row * this.tileSpacingY + offsetY,
          index: index++
        });
      }
    }

    return positions;
  });

  private readonly resizeHandler = () => {
    this.viewportWidth.set(window.innerWidth);
    this.viewportHeight.set(window.innerHeight);
  };

  ngOnInit() {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }

}
