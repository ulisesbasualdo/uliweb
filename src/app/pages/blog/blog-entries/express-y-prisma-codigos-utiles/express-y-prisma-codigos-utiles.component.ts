import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';
import { CodeShower } from '../../../../shared/components/code-shower/code-shower';
import { ContentWrapperDirective } from '../../directives/content-wrapper';
import { VerticalStepper } from '../../../../shared/directives/vertical-stepper';
import { BlogService } from '../../services/blog.service';

@BlogEntry({
  category: 'General',
  title: 'Express Y Prisma Comandos Útiles',
  needsWrap: true,
  date: new Date('2025-10-26'),
})
@Component({
  selector: 'app-express-y-prisma-codigos-utiles',
  imports: [CodeShower, ContentWrapperDirective, VerticalStepper],
  template: `
  <div
  appContentWrapper
  [entryId]="entryId"
  (isCollapsed)="stepperVisible.set(!$event);"
  appUliVerticalStepper [visible]="stepperVisible()"
  >
    <p>Caso 1: Modificaste las interfaces y los modelos y querés hacer un reinicio completo de la base de datos</p>
    <p class="warning">Precaución: Esto borrará todo lo existente de la base de datos</p>

    <ul class="list-group">
      Pasos
      <li  class="list-group-item">1: Borrar la carpeta prisma/migrations manualmente o con powershell:
        <uli-code-shower step step1 [code]="powerShellRemoveFolder" language="Powershell" />

      </li>
      <li  class="list-group-item">
        2: Elimina la estructura y datos de la base de datos forzosamente:
        <uli-code-shower data-see-more-point  step step2 [code]="'npx prisma migrate reset --force --skip-seed'" language="Terminal" />
      </li>
      <li  class="list-group-item">
        3: escribir el siguiente comando para crear una nueva migración
        <uli-code-shower step step3 [code]="'npx prisma migrate dev --name init'" language="Terminal" />
      </li>
      <li  class="list-group-item">
        4: si tienes un a archivo seed.ts para ingreso de datos de prueba, ejecútalo:
        <uli-code-shower step step4 [code]="'npx prisma db seed'" language="Terminal" />
      </li>
    </ul>
</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpressYPrismaCodigosUtilesComponent {
  private readonly blogService = inject(BlogService);
  protected stepperVisible = signal(true);
  protected get entryId(): number {
    const entry = this.blogService.allEntries().find(
      e => e.component === ExpressYPrismaCodigosUtilesComponent
    );
    return entry?.id ?? 1;
  }
  protected powerShellRemoveFolder = `Remove-Item -Path .\\prisma\\migrations -Recurse -Force`
}
