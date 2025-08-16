param([Parameter(Mandatory=$true)][string]$ComponentName)

Write-Host "Creando componente de blog: $ComponentName"

ng generate component $ComponentName --path src/app/pages/blog/blog-entries

if ($LASTEXITCODE -eq 0) {
  Write-Host "Componente creado exitosamente"
  Write-Host "Modificando archivo..."

  $componentPath = "src/app/pages/blog/blog-entries/$ComponentName/$ComponentName.component.ts"

  if (Test-Path $componentPath) {
    $content = Get-Content $componentPath -Raw
    $className = (($ComponentName -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join '') + 'Component'
    $title = ($ComponentName -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ' '

    # Reemplazar todo el contenido para evitar problemas
    $newContent = @"
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'General',
  title: '$title',
  date: new Date(),
})
@Component({
  selector: 'app-$ComponentName',
  imports: [],
  template: ``
  <div class="content">
    <h2>$title</h2>
    <p>Contenido del artículo aquí...</p>
  </div>
  ``,
  styles: ``
  .content {
    padding: 1.5rem;
    line-height: 1.6;
    color: #e0e0e0;
  }

  h2 {
    color: #fff;
    margin-bottom: 1rem;
  }
  ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class $className {

}
"@

    $newContent | Set-Content $componentPath -Encoding UTF8

    Write-Host "Decorador agregado correctamente"
  }

  Write-Host "Actualizando indice..."
  npm run generate:blog-index

  if ($LASTEXITCODE -eq 0) {
    Write-Host "Componente creado y configurado correctamente!"
    Write-Host "Archivo creado en: $componentPath"
  }
}
