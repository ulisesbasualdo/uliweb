import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirtyResetComponent } from './dirty-reset-post.component';

describe('DirtyResetComponent', () => {
  let component: DirtyResetComponent;
  let fixture: ComponentFixture<DirtyResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirtyResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirtyResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
