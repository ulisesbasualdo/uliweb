import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { DirtyReset } from "../../../../shared/directives/dirty-reset";

@Component({
  selector: 'app-dirty-reset-example-form',
  imports: [ReactiveFormsModule, DirtyReset],
  standalone: true,
  template: `
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
  `,
  styleUrl: './example-form-dirty-reset.scss',
})
export class DirtyResetExampleForm {

  fb = inject(FormBuilder);

  exampleForm = this.fb.group({
    name: [''],
    email: [''],
    age: ['27'],
  });

 }
