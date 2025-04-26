import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dailyCalories',
  standalone: true
})
export class DailyCaloriesPipe implements PipeTransform {

  transform(weight: number, gender: 'férfi' | 'nő', unit: 'metric' | 'imperial' = 'metric'): number {
    if (!weight || !gender) {
      return 0;
    }

    if (unit === 'imperial') {
      weight = weight * 0.453592;
    }

    if (gender === 'férfi') {
      return Math.round(weight * 24);
    } else if (gender === 'nő') {
      return Math.round(weight * 22);
    } else {
      return 0;
    }
  }
}