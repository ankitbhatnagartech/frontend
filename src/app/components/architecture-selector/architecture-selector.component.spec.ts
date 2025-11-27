import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureSelectorComponent } from './architecture-selector.component';

describe('ArchitectureSelectorComponent', () => {
  let component: ArchitectureSelectorComponent;
  let fixture: ComponentFixture<ArchitectureSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchitectureSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchitectureSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
