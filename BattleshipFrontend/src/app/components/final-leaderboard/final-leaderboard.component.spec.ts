import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalLeaderboardComponent } from './final-leaderboard.component';

describe('FinalLeaderboardComponent', () => {
  let component: FinalLeaderboardComponent;
  let fixture: ComponentFixture<FinalLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalLeaderboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
