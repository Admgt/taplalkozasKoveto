import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { getAuth } from '@angular/fire/auth';
import { Food } from '../../models/food.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider'

@Component({
  selector: 'app-add-food',
  standalone: true,
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss'],
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatSliderModule, MatInputModule, MatIconModule, MatDividerModule, MatOptionModule, MatChipsModule, MatProgressBarModule],
})
export class AddFoodComponent {
  food: Food = {
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString().split('T')[0],
    userId: '',
    servingSize: 100,
  };

  constructor(private foodService: FoodService) {}

  addFood() {
    const user = getAuth().currentUser;
    if (!user) {
      alert('Nem vagy bejelentkezve!');
      return;
    }

    const foodWithUser = {
      ...this.food,
      userId: user.uid
    };
  
    this.foodService.addFood(foodWithUser).then(() => {
      alert('Étel hozzáadva!');
      this.food = {
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        date: new Date().toISOString().split('T')[0],
        userId: '',
        servingSize: 100,
      };
    });
  }

  calculateHealthScore(): number {
    if (!this.food.calories) return 0;
    
    const proteinRatio = this.food.protein ? (this.food.protein * 4) / this.food.calories * 100 : 0;
    const fatRatio = this.food.fat ? (this.food.fat * 9) / this.food.calories * 100 : 0;
    
    let score = 50; 
    score += proteinRatio * 2; 
    score -= fatRatio * 0.5;   
    
    return Math.min(100, Math.max(0, score));
  }
}
