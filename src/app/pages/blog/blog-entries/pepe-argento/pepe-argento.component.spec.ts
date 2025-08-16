import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepeArgentoComponent } from './pepe-argento.component';

describe('PepeArgentoComponent', () => {
  let component: PepeArgentoComponent;
  let fixture: ComponentFixture<PepeArgentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PepeArgentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PepeArgentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
