import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDashboardComponent } from './cost-dashboard.component';

describe('CostDashboardComponent', () => {
  let component: CostDashboardComponent;
  let fixture: ComponentFixture<CostDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
