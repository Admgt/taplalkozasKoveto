import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { FoodService } from '../../services/food.service';
import { AuthService } from '../../services/auth.service';
import { UserPreferencesService } from '../../services/user-preferences.service';

import { Food } from '../../models/food.model';
import { EditableFood } from '../../models/editable-food.model';
import { FoodTotals } from '../../models/food-totals.model';

import { NaploFoodComponent } from '../naplo-food/naplo-food.component';

@Component({
  selector: 'app-food-log',
  standalone: true,
  imports: [
    CommonModule, 
    NgFor, 
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatIconModule, 
    MatListModule, 
    MatButtonModule,
    NaploFoodComponent
  ],
  templateUrl: './food-log.component.html',
  styleUrl: './food-log.component.scss'
})
export class FoodLogComponent implements OnInit {
  currentlyEditingId: string | null = null;
  selectedDate: Date = new Date();
  allFoods: Food[] = [];

  today = new Date().toISOString().substring(0, 10);
  foods: Food[] = [];
  totals: FoodTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  unit: 'metric' | 'imperial' = 'metric';

  constructor(
    private foodService: FoodService, 
    private authService: AuthService, 
    private router: Router, 
    private preferencesService: UserPreferencesService
  ) {}

  async ngOnInit() {
    const user = getAuth().currentUser;
    if (user) {
      const prefs = await this.preferencesService.getPreferences(user.uid);
      if (prefs && prefs.unit) {
        this.unit = prefs.unit;
      }

      this.foodService.getFoodsForUser(user.uid).subscribe(foods => {
        this.allFoods = foods;
        this.updateFilteredFoods();
      });
    }
  }

  updateFilteredFoods() {
    const dateString = this.formatDate(this.selectedDate);
    this.foods = this.allFoods.filter(food => food.date === dateString);
    this.calculateTotals();
  }

  calculateTotals() {
    this.totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    for (let food of this.foods) {
      this.totals.calories += food.calories;
      this.totals.protein += food.protein;
      this.totals.carbs += food.carbs;
      this.totals.fat += food.fat;
    }
  }

  onDateChange() {
    this.updateFilteredFoods();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Eseménykezelők a gyerek komponenshez
  onEditStart(food: Food): void {
    this.currentlyEditingId = food.id || null;
  }

  onEditSave(updatedFood: EditableFood): void {
    if (this.currentlyEditingId !== null) {
      this.foodService.updateFood(this.currentlyEditingId, {
        ...updatedFood,
        date: this.formatDate(this.selectedDate)
      }).then(() => {
        this.currentlyEditingId = null;
      });
    }
  }

  onEditCancel(): void {
    this.currentlyEditingId = null;
  }

  onDeleteFood(id: string): void {
    if (confirm('Biztosan törölni szeretnéd ezt az ételt?')) {
      this.foodService.deleteFood(id).then(() => {
        this.foods = this.foods.filter(f => f.id !== id);
        this.calculateTotals();
      });
    }
  }

  addFood(newFood: Partial<Food>) {
    const user = getAuth().currentUser;
    if (!user) return;

    const foodToAdd: Food = {
      name: newFood.name || '',
      calories: newFood.calories || 0,
      protein: newFood.protein || 0,
      carbs: newFood.carbs || 0,
      fat: newFood.fat || 0,
      date: this.formatDate(this.selectedDate),
      userId: user.uid,
      servingSize: newFood.servingSize || 100,
    };

    this.foodService.addFood(foodToAdd).then(() => {
      this.updateFilteredFoods();
    });
  }
}