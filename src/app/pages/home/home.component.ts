import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserPreferences } from '../../models/user-preferences.model';
import { Food } from '../../models/food.model';
import { map, Observable } from 'rxjs';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { FoodService } from '../../services/food.service';
import { firstValueFrom } from 'rxjs';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userPreferences?: UserPreferences;
  todaysFoods$!: Observable<Food[]>;
  dailyCalorieNeed: number = 0;
  totalCaloriesToday: number = 0;
  userWeight: number = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private userPrefService: UserPreferencesService,
    private foodService: FoodService) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.getCurrentUser());
  if (!user) return;

  const userData = await this.authService.getUserData(user.uid);
  const prefs = await this.userPrefService.getPreferences(user.uid);

  if (prefs && userData) {
    this.userPreferences = prefs;
    this.userWeight = userData.currentWeight; 
    this.calculateDailyCalories();
  }

  const today = new Date().toISOString().split('T')[0]; 
  this.todaysFoods$ = this.foodService.getFoodsForUserByDate(user.uid, today);

  this.todaysFoods$.pipe(
    map(foods => foods.reduce((sum, food) => sum + food.calories, 0))
  ).subscribe(total => {
    this.totalCaloriesToday = total;
  });
  }
  
  calculateDailyCalories() {
    if (!this.userPreferences || !this.userWeight) {
      this.dailyCalorieNeed = 0;
      return;
    }
  
    const weight = this.userPreferences.unit === 'imperial'
      ? this.userWeight * 0.453592 
      : this.userWeight;
  
    const targetWeight = this.userPreferences.unit === 'imperial'
      ? this.userPreferences.targetWeight * 0.453592
      : this.userPreferences.targetWeight;
  
    const weightDiff = targetWeight - weight;
  
    const bmr = weight * 24;
  
    const calorieAdjustment = weightDiff * 110; 
    this.dailyCalorieNeed = Math.round(bmr + calorieAdjustment);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }
}
