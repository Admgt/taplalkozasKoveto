import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'unitConversion',
    standalone: true
  })
  export class UnitConversionPipe implements PipeTransform {

    transform(value: number, unit: 'metric' | 'imperial'): string {
      if (typeof value !== 'number') {
        return '';
      }
  
      if (unit === 'metric') {
        const pounds = value * 2.20462;
        return `${pounds.toFixed(1)} lbs`;
      }
  
      const kilo = value / 2.20462;
      return `${kilo.toFixed(1)} kg`;
    }
  }