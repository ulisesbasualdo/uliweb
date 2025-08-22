# VerticalStepper Directive

Directiva Angular que renderiza un stepper vertical con efectos neón que sigue el progreso de elementos marcados con `[step]`.

## Uso básico

```typescript
@Component({
  selector: 'app-example',
  imports: [VerticalStepperDirective],
  template: `
    <article appVerticalStepper
      [startStep]="20"
      [separateLeft]="50"
      verticalLineNeonColor="#1FFFCE"
      stepColor="yellow"
      finalStepColor="#80FF1F">
      
      <section step>Paso 1</section>
      <section step>Paso 2</section>
      <section step>Paso 3</section>
    </article>
  `
})
export class ExampleComponent {}
```

## Uso con contenido colapsable
### Cuando tenemos un componente que colapsa el contenido agregamos [attr.data-content-collapsed]="!isExpanded()"

```typescript
@Component({
  selector: 'app-blog-content-wrapper',
  template: `
    <div class="blog-content-container" #contentContainer>
      <div
        class="content-inner"
        [class.collapsed]="!isExpanded()"
        [attr.data-content-collapsed]="!isExpanded()"
        [style.max-height]="maxHeight()">
        <ng-content></ng-content>

        @if (!isExpanded() && hasSeeMorePoint()) {
          <div class="fade-overlay"></div>
        }
      </div>

      @if (hasSeeMorePoint()) {
        <div
          class="see-more-controls"
          [class.state-collapsed]="!isExpanded()"
          [class.state-expanded]="isExpanded()">
          @if (!isExpanded()) {
            <button class="see-more-btn" (click)="toggleExpanded()">Ver más ▼</button>
          } @else {
            <button class="see-less-btn" (click)="toggleExpanded()">Ver menos ▲</button>
          }
        </div>
      }
    </div>`
}),
export class BlogExampleComponent {}
```

## Propiedades

- `startStep`: La separación vertical que tiene el primer step de la línea de neón del primer step donde se aplica "step step1"
- `separateLeft`: Separación desde el borde izquierdo
- `verticalLineNeonColor`: Color de la línea de progreso
- `stepColor`: Color de los pasos activos
- `finalStepColor`: Color del último paso
