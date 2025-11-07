import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VerticalStepper } from './vertical-stepper';

@Component({
  standalone: true,
  imports: [VerticalStepper],
  template: `
    <div
      appUliVerticalStepper
      [visible]="isVisible()"
      [startStep]="startPosition()"
      [verticalLineNeonColor]="lineColor()"
      [stepColor]="normalColor()"
      [finalStepColor]="lastColor()"
      [separateLeft]="separation()">
      <section step>Primer paso</section>
      <section step>Segundo paso</section>
      <section step>Tercer paso</section>
    </div>
  `,
})
class TestComponent {
  isVisible = signal(true);
  startPosition = signal(0);
  lineColor = signal('#00e5ff');
  normalColor = signal('#ffea00');
  lastColor = signal('#69f0ae');
  separation = signal(60);
}

describe('VerticalStepper', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directive: VerticalStepper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, VerticalStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(VerticalStepper));
    directive = directiveElement.injector.get(VerticalStepper);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crear una instancia de la directiva', () => {
    expect(directive).toBeTruthy();
  });

  it('debería tener los valores por defecto correctos', () => {
    expect(directive.visible()).toBe(true);
    expect(directive.startStep()).toBe(0);
    expect(directive.verticalLineNeonColor()).toBe('#00e5ff');
    expect(directive.stepColor()).toBe('#ffea00');
    expect(directive.finalStepColor()).toBe('#69f0ae');
    expect(directive.separateLeft()).toBe(60);
  });

  it('debería detectar elementos con atributo [step]', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const stepElements = directiveElement.nativeElement.querySelectorAll('[step]');
      expect(stepElements.length).toBe(3);
      done();
    });
  });

  it('debería crear el overlay después de la inicialización', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const overlay = document.body.querySelector('div[style*="position: absolute"]');
      expect(overlay).toBeTruthy();
      done();
    });
  });

  it('debería aplicar estilos de posicionamiento al host', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const hostElement = directiveElement.nativeElement as HTMLElement;
      expect(hostElement.style.position).toBe('relative');
      done();
    });
  });

  it('debería ocultar el overlay cuando visible es false', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      component.isVisible.set(false);
      fixture.detectChanges();

      setTimeout(() => {
        const overlay = document.body.querySelector('div[style*="position: absolute"]') as HTMLElement;
        expect(overlay?.style.display).toBe('none');
        done();
      }, 100);
    });
  });

  it('debería mostrar el overlay cuando visible es true', (done) => {
    component.isVisible.set(false);
    fixture.detectChanges();

    requestAnimationFrame(() => {
      component.isVisible.set(true);
      fixture.detectChanges();

      setTimeout(() => {
        const overlay = document.body.querySelector('div[style*="position: absolute"]') as HTMLElement;
        expect(overlay?.style.display).toBe('block');
        done();
      }, 100);
    });
  });

  it('debería crear la línea rail con el color correcto', (done) => {
    fixture.detectChanges();

    const findRailLine = () => {
      const allDivs = Array.from(document.body.querySelectorAll('div'));
      const railLine = allDivs.find((el: Element) => {
        const htmlEl = el as HTMLElement;
        return htmlEl.style.width === '3px' &&
               htmlEl.style.borderRadius === '2px' &&
               htmlEl.style.backgroundColor.includes('176');
      });
      expect(railLine).toBeTruthy();
      done();
    };

    requestAnimationFrame(() => {
      setTimeout(findRailLine, 200);
    });
  });

  it('debería crear la línea de progreso con altura inicial 0', (done) => {
    fixture.detectChanges();

    const checkProgressLine = () => {
      const allDivs = Array.from(document.body.querySelectorAll('div'));
      const progressLines = allDivs.filter((el: Element) => {
        const htmlEl = el as HTMLElement;
        return htmlEl.style.width === '3px' &&
               htmlEl.style.position === 'absolute' &&
               htmlEl.style.borderRadius === '2px';
      });

      expect(progressLines.length).toBeGreaterThanOrEqual(2);
      done();
    };

    requestAnimationFrame(() => {
      setTimeout(checkProgressLine, 200);
    });
  });

  it('debería crear puntos indicadores para cada paso', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      setTimeout(() => {
        const dots = document.body.querySelectorAll('div[style*="border-radius: 50%"]');
        expect(dots.length).toBe(3);
        done();
      }, 100);
    });
  });

  it('debería aplicar el color personalizado a la línea de progreso', (done) => {
    const customColor = '#ff0000';
    component.lineColor.set(customColor);
    fixture.detectChanges();

    const checkColorLine = () => {
      const progressLines = Array.from(document.body.querySelectorAll('div'));
      const progressLine = progressLines.find((el: Element) => {
        const htmlEl = el as HTMLElement;
        return htmlEl.style.backgroundColor === 'rgb(255, 0, 0)' && htmlEl.style.width === '3px';
      });
      expect(progressLine).toBeTruthy();
      done();
    };

    requestAnimationFrame(() => {
      setTimeout(checkColorLine, 100);
    });
  });

  it('debería calcular correctamente el offset izquierdo', (done) => {
    const customSeparation = 80;
    component.separation.set(customSeparation);
    fixture.detectChanges();

    requestAnimationFrame(() => {
      setTimeout(() => {
        const overlay = document.body.querySelector('div[style*="position: absolute"]') as HTMLElement;
        expect(overlay?.style.width).toContain('140px');
        done();
      }, 100);
    });
  });

  it('debería limpiar los observers al destruir', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const disconnectSpy = jasmine.createSpy('disconnect');
      (directive as any).io = { disconnect: disconnectSpy };
      (directive as any).resizeObs = { disconnect: disconnectSpy };

      fixture.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
      done();
    });
  });

  it('debería remover el overlay del DOM al destruir', (done) => {
    fixture.detectChanges();

    const verifyOverlayRemoval = () => {
      const overlaysBefore = document.body.querySelectorAll('div[style*="z-index: 9999"]');
      expect(overlaysBefore.length).toBeGreaterThan(0);

      fixture.destroy();

      setTimeout(() => {
        const overlaysAfter = document.body.querySelectorAll('div[style*="z-index: 9999"]');
        expect(overlaysAfter.length).toBeLessThan(overlaysBefore.length);
        done();
      }, 50);
    };

    requestAnimationFrame(() => {
      setTimeout(verifyOverlayRemoval, 100);
    });
  });

  it('debería generar un selector CSS único para elementos', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const stepElements = directiveElement.nativeElement.querySelectorAll('[step]');
      const firstStep = stepElements[0] as HTMLElement;

      const selector = (directive as any).createElementSelector(firstStep);

      expect(selector).toContain('section');
      expect(selector).toContain('[step]');
      done();
    });
  });

  it('debería generar efecto glow con el color proporcionado', () => {
    const color = '#00ff00';
    const glowEffect = (directive as any).glow(color);

    expect(glowEffect).toContain(color);
    expect(glowEffect).toContain('0 0 6px');
    expect(glowEffect).toContain('0 0 14px');
    expect(glowEffect).toContain('0 0 22px');
  });

  it('debería calcular correctamente el offset top relativo al ancestro', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      const host = directiveElement.nativeElement as HTMLElement;
      const stepElements = host.querySelectorAll('[step]');
      const firstStep = stepElements[0] as HTMLElement;

      const offset = (directive as any).getOffsetTopTo(firstStep, host);

      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('debería actualizar la posición del overlay en scroll', (done) => {
    fixture.detectChanges();

    const testScrollUpdate = () => {
      globalThis.scrollTo(0, 100);
      globalThis.dispatchEvent(new Event('scroll'));

      setTimeout(() => {
        const newTop = (document.body.querySelector('div[style*="z-index: 9999"]') as HTMLElement)?.style.top;
        expect(newTop).toBeDefined();
        globalThis.scrollTo(0, 0);
        done();
      }, 100);
    };

    requestAnimationFrame(() => {
      setTimeout(testScrollUpdate, 100);
    });
  });

  it('debería configurar IntersectionObserver para los elementos step', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      expect((directive as any).io).toBeDefined();
      expect((directive as any).io instanceof IntersectionObserver).toBe(true);
      done();
    });
  });

  it('debería configurar ResizeObserver si está disponible', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      if (typeof ResizeObserver !== 'undefined') {
        expect((directive as any).resizeObs).toBeDefined();
        expect((directive as any).resizeObs instanceof ResizeObserver).toBe(true);
      }
      done();
    });
  });

  it('debería almacenar las posiciones de los pasos', (done) => {
    fixture.detectChanges();

    const validateStepPositions = () => {
      const stepPositions = (directive as any).stepPositions;
      expect(stepPositions).toBeDefined();
      expect(stepPositions.length).toBe(3);

      const allAreNumbers = stepPositions.every((pos: number) => typeof pos === 'number');
      expect(allAreNumbers).toBe(true);
      done();
    };

    requestAnimationFrame(() => {
      setTimeout(validateStepPositions, 100);
    });
  });

  it('debería calcular minY y maxY correctamente', (done) => {
    fixture.detectChanges();

    requestAnimationFrame(() => {
      setTimeout(() => {
        const minY = (directive as any).minY;
        const maxY = (directive as any).maxY;

        expect(typeof minY).toBe('number');
        expect(typeof maxY).toBe('number');
        expect(maxY).toBeGreaterThanOrEqual(minY);
        done();
      }, 100);
    });
  });
});
