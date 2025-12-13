import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';
import { BlogHeader } from '../../components/blog-header';
import { BlogService } from '../../services/blog.service';
import { CodeShower } from '../../../../shared/components/code-shower/code-shower';
import { ContentWrapperDirective } from '../../directives/content-wrapper';
import { DirtyResetExampleForm } from "./example-form-dirty-reset";

@BlogEntry({
  category: 'General',
  title: 'Cómo crear una directiva Dirty Reset para formularios en Angular',
  date: new Date('2025-12-09'),
  needsWrap: true,
})
@Component({
  selector: 'app-dirty-reset',
  imports: [BlogHeader, CodeShower, ContentWrapperDirective, DirtyResetExampleForm],
  template: `
    <article class="dirty-reset" appContentWrapper [entryId]="entryId">
      <app-blog-header src="blog-img/dirty-reset.jpg" alt="un humano limpiando un formulario" />
      <p class="intro mt-3 mb-4">
        La directiva reutilizable <code>DirtyReset</code> controla el
        <strong>habilitado y deshabilitado</strong> de un botón de reset según si un
        <strong>formulario reactivo de Angular fue modificado</strong> o no. Cuando el formulario
        está en su <strong>estado inicial</strong>, el botón se deshabilita; al detectar cambios,
        se habilita para permitir restablecer los <strong>valores originales</strong>. Si el usuario
        vuelve a dejar el formulario igual que al principio, el botón se deshabilita otra vez. Esto
        mejora la <strong>experiencia de usuario</strong> al evitar restablecimientos innecesarios
        y mantener la <strong>coherencia del estado del formulario</strong>.
      </p>
      <h2 class="section-title">Ejemplo real</h2>
      <section data-see-more-point class="demo">
        <app-dirty-reset-example-form />
      </section>

      <h2 class="section-title">Código</h2>
      <section class="code">
        <uli-code-shower  [headerTitle]="'shared/directives/dirty-reset.ts'" [code]="dirtyReset" language="typescript" />
        <uli-code-shower [headerTitle]="'example.html'" [code]="useCaseHTML" language="html" />
        <uli-code-shower [headerTitle]="'example.ts'" [code]="useCaseTS" language="typescript" />
      </section>
    </article>
  `,
  styleUrl: './dirty-reset-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirtyResetComponent {
  private readonly blogService = inject(BlogService);
  protected get entryId(): number {
    const entry = this.blogService.allEntries().find(e => e.component === DirtyResetComponent);
    return entry?.id ?? 1;
  }
  protected dirtyReset = `import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  inject,
  input,
  output,
  effect,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

type OriginalValues = Record<string, any>;

@Directive({
  selector: '[appDirtyReset],[app-dirty-reset]',
  standalone: true,
})
export class DirtyReset {
  form = input.required<FormGroup>();
  handleReset = input<boolean>(false);
  resetted = output<void>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.handleReset()) {
      this.resetForm();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private initialValues: OriginalValues = {};
  private initialValuesSaved = false;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const form = this.form();
      if (!this.initialValuesSaved) {
        this.saveInitialValues();
      }
      if (form) {
        this.updateButtonState();
        form.valueChanges.subscribe(() => this.updateButtonState());
        form.statusChanges.subscribe(() => this.updateButtonState());
      }
    });
  }

  private saveInitialValues(): void {
    this.initialValues = this.form().getRawValue();
    this.initialValuesSaved = true;
  }

  private updateButtonState(): void {
    const form = this.form();
    if (!form) return;

    const isEqual: boolean = this.isEqual(
      form.getRawValue(),
      this.initialValues
    );

    if (isEqual) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      this.renderer.addClass(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      this.renderer.removeClass(this.el.nativeElement, 'disabled');
    }
  }

  private isEqual(obj1: any, obj2: any): boolean {
    const normalizeValue = (value: any): any => {
      if (value === null || value === '') {
        return null;
      }
      if (
        typeof value === 'number' ||
        (typeof value === 'string' && !Number.isNaN(Number(value)))
      ) {
        return String(value);
      }
      return value;
    };

    const normalizeObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(normalizeObject);
      }
      if (obj !== null && typeof obj === 'object') {
        const normalized: any = {};
        for (const key in obj) {
          if (Object.hasOwn(obj, key)) {
            normalized[key] = normalizeObject(obj[key]);
          }
        }
        return normalized;
      }
      return normalizeValue(obj);
    };

    const normalizedObj1 = normalizeObject(obj1);
    const normalizedObj2 = normalizeObject(obj2);

    return JSON.stringify(normalizedObj1) === JSON.stringify(normalizedObj2);
  }

  resetForm(): void {
    if (this.form()) {
      this.form().reset(this.initialValues);
      setTimeout(() => {
        this.form().markAsPristine();
        this.form().markAsUntouched();
        this.updateButtonState();
        this.resetted.emit();
      }, 0);
    }
  }
}

`;

  protected useCaseHTML = `
<!-- Importar en el ts la DirtyReset -->
     <div class="example-form">
      <form class="form form-dark" [formGroup]="exampleForm">
        <div class="form-group mb-3">
          <label class="form-label" for="name">Nombre</label>
          <input class="form-control mt-1" id="name" formControlName="name" type="text" />
        </div>

        <div class="form-group mb-3">
          <label class="form-label" for="email">Correo Electrónico</label>
          <input class="form-control mt-1" id="email" formControlName="email" type="email" />
        </div>

        <div class="form-group mb-3">
          <label class="form-label" for="age">Edad</label>
          <input class="form-control mt-1" id="age" formControlName="age" type="number" />
        </div>

        <div class="btn-row">
          <button
            class="reset-btn"
            type="button"
            appDirtyReset
            [form]="exampleForm"
            [handleReset]="true">
            Restablecer Campos
          </button>
        </div>
      </form>
    </div>
`;

protected useCaseTS = `
// Importar en los imports la directiva

export class DirtyResetExampleForm {

  fb = inject(FormBuilder);

  exampleForm = this.fb.group({
    name: [''],
    email: [''],
    age: ['27'],
  });

 }

`
}
