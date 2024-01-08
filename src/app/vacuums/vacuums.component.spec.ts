import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacuumsComponent } from './vacuums.component';

describe('VacuumsComponent', () => {
  let component: VacuumsComponent;
  let fixture: ComponentFixture<VacuumsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacuumsComponent]
    });
    fixture = TestBed.createComponent(VacuumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
