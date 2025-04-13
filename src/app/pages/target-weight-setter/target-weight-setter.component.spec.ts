import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetWeightSetterComponent } from './target-weight-setter.component';

describe('CalorieGoalSetterComponent', () => {
  let component: TargetWeightSetterComponent;
  let fixture: ComponentFixture<TargetWeightSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetWeightSetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetWeightSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
