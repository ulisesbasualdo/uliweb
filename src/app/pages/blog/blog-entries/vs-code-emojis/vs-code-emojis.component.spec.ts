import { ComponentFixture, TestBed } from '@angular/core/testing';

import VsCodeEmojisComponent from './vs-code-emojis.component';

describe('VsCodeEmojisComponent', () => {
  let component: VsCodeEmojisComponent;
  let fixture: ComponentFixture<VsCodeEmojisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsCodeEmojisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsCodeEmojisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
