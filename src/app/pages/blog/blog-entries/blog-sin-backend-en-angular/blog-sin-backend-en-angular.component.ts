import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'Angular',
  title: 'Blog sin backend en angular',
  date: new Date('2025-08-15'),
})
@Component({
  selector: 'app-blog-sin-backend-en-angular',
  imports: [],
  templateUrl: './blog-sin-backend-en-angular.component.html',
  styleUrl: './blog-sin-backend-en-angular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogSinBackendEnAngularComponent {}
