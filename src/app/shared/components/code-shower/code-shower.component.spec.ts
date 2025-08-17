import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeShowerComponent } from './code-shower.component';

describe('CodeShowerComponent', () => {
  let component: CodeShowerComponent;
  let fixture: ComponentFixture<CodeShowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeShowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeShowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
