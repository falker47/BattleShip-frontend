import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardInfoComponent } from './board-info.component';

describe('BoardInfoComponent', () => {
  let component: BoardInfoComponent;
  let fixture: ComponentFixture<BoardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
