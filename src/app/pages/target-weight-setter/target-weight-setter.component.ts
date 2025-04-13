import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserPreferences } from '../../models/user-preferences.model';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';

@Component({
  selector: 'app-target-weight-setter',
  standalone: true,
  imports: [CommonModule, UnitConversionPipe],
  templateUrl: './target-weight-setter.component.html',
  styleUrl: './target-weight-setter.component.scss'
})
export class TargetWeightSetterComponent {
  @Input() currentWeight!: number; 
  @Input() targetWeight!: number;
  @Input() unit: 'metric' | 'imperial' = 'metric';
  @Output() targetWeightChanged = new EventEmitter<number>();

  recommendedCalories!: number;

  ngOnInit(): void {
    this.calculateCalories();
  }

  onWeightChange(value: number) {
    this.targetWeight = value;
    this.targetWeightChanged.emit(this.targetWeight);
    this.calculateCalories();
  }

  calculateCalories() {
    let currentWeightKg = this.currentWeight;
    let targetWeightKg = this.targetWeight;
    
    if (this.unit === 'imperial') {
      currentWeightKg = this.currentWeight / 2.20462;
      targetWeightKg = this.targetWeight / 2.20462;
    }

    const weightDifference = this.targetWeight - this.currentWeight;
    const caloriesPerKg = 7700; 
    const days = 60; 

    const totalCalorieDiff = weightDifference * caloriesPerKg;
    const dailyCalorieChange = totalCalorieDiff / days;

    this.recommendedCalories = 2200 - dailyCalorieChange;
  }

  getUnitLabel(): string {
    return this.unit === 'metric' ? 'kg' : 'lbs';
  }
}
