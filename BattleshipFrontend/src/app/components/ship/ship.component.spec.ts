import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipComponent } from './ship.component';

describe('PlayerComponent', () => {
  let component: ShipComponent;
  let fixture: ComponentFixture<ShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
