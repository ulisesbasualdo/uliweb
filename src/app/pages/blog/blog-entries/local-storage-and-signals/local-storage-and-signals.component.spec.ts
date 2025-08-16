import { ComponentFixture, TestBed } from '@angular/core/testing';

import {LocalStorageAndSignalsComponent} from './local-storage-and-signals.component';

describe('LocalStorageAndSignalsComponent', () => {
  let component: LocalStorageAndSignalsComponent;
  let fixture: ComponentFixture<LocalStorageAndSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalStorageAndSignalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalStorageAndSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
