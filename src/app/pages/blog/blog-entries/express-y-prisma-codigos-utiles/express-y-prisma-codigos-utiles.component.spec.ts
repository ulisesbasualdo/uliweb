import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressYPrismaCodigosUtilesComponent } from './express-y-prisma-codigos-utiles.component';

describe('ExpressYPrismaCodigosUtilesComponent', () => {
  let component: ExpressYPrismaCodigosUtilesComponent;
  let fixture: ComponentFixture<ExpressYPrismaCodigosUtilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressYPrismaCodigosUtilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressYPrismaCodigosUtilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
