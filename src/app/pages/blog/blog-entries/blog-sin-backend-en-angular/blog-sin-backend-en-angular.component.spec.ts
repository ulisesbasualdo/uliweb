import { ComponentFixture, TestBed } from '@angular/core/testing';

import {BlogSinBackendEnAngularComponent} from './blog-sin-backend-en-angular.component';

describe('BlogSinBackendEnAngularComponent', () => {
  let component: BlogSinBackendEnAngularComponent;
  let fixture: ComponentFixture<BlogSinBackendEnAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSinBackendEnAngularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogSinBackendEnAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
