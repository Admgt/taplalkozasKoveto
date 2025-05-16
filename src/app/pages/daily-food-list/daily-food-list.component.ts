import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food } from '../../models/food.model';

@Component({
  selector: 'app-daily-food-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-food-list.component.html',
  styleUrls: ['./daily-food-list.component.scss']
})
export class DailyFoodListComponent {
  @Input() foods: Food[] = [];
  @Output() foodDeleted = new EventEmitter<string>();

  deleteFood(foodId: string): void {
    this.foodDeleted.emit(foodId);
  }
}