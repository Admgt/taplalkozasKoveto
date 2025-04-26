import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserPreferences } from '../../models/user-preferences.model';
import { Food } from '../../models/food.model';
import { BehaviorSubject, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { FoodService } from '../../services/food.service';
import { firstValueFrom } from 'rxjs';
import { DailyFoodService } from '../../services/daily-food.service';
import { DailyCaloriesPipe } from '../../pipes/daily-calories.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DailyCaloriesPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userPreferences?: UserPreferences;
  todaysFoods$!: Observable<Food[]>;
  dailyCalorieNeed: number = 0;
  totalCaloriesToday: number = 0;
  userWeight: number = 0;

  private refreshTrigger = new BehaviorSubject<boolean>(true);
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private router: Router,
    private userPrefService: UserPreferencesService,
    private foodService: FoodService,
    private dailyFoodService: DailyFoodService) {
      this.subscribeToFoodChanges();
    }

    subscribeToFoodChanges() {
      const foodChangeSub = this.dailyFoodService.foodAdded$.subscribe(() => {
        console.log('Új étel érkezett, frissítés...');
        this.refreshFoods();
      });
      
      this.subscriptions.push(foodChangeSub);
    }

  async ngOnInit() {
    await this.loadUserData();
    await this.loadTodaysFoods();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async loadUserData() {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) return;

    const userData = await this.authService.getUserData(user.uid);
    const prefs = await this.userPrefService.getPreferences(user.uid);

    if (prefs && userData) {
      this.userPreferences = prefs;
      this.userWeight = userData.currentWeight;
      this.calculateDailyCalories();
    }
  }

  async loadTodaysFoods() {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    this.todaysFoods$ = this.refreshTrigger.pipe(
      switchMap(() => this.dailyFoodService.getDailyFoodsByDate(user.uid, today)),
      switchMap(dailyFoods => {
        const foodIds = dailyFoods.map(df => df.foodId);
        if (foodIds.length === 0) return of([]);
        return this.foodService.getFoodsByIds(foodIds);
      })
    );

    const calorieSub = this.todaysFoods$.pipe(
      map(foods => foods.reduce((sum, food) => sum + food.calories, 0))
    ).subscribe(total => {
      this.totalCaloriesToday = total;
    });

    this.subscriptions.push(calorieSub);
  }

  refreshFoods() {
    this.refreshTrigger.next(true);
  }

  getGender(): 'férfi' | 'nő' {
    return this.userPreferences?.gender === 'nő' ? 'nő' : 'férfi';
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
