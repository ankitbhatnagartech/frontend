import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficInputComponent } from './traffic-input.component';

describe('TrafficInputComponent', () => {
  let component: TrafficInputComponent;
  let fixture: ComponentFixture<TrafficInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrafficInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
