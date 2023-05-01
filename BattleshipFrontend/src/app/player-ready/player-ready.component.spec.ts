import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerReadyComponent } from './player-ready.component';

describe('PlayerReadyComponent', () => {
  let component: PlayerReadyComponent;
  let fixture: ComponentFixture<PlayerReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerReadyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
