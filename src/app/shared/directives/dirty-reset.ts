import {
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
