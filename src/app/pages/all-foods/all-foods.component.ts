import { Component } from '@angular/core';
import { Food } from '../../models/food.model';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { FoodService } from '../../services/food.service';
import { DailyFoodService } from '../../services/daily-food.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-foods',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDividerModule, ReactiveFormsModule],
  templateUrl: './all-foods.component.html',
  styleUrl: './all-foods.component.scss'
})
export class AllFoodsComponent {
  foods$!: Observable<Food[]>;

  searchControl = new FormControl('');
  filteredFoods$!: Observable<Food[]>;
  originalFoods$ = new BehaviorSubject<Food[]>([]);

  constructor(
    private foodService: FoodService,
    private dailyFoodService: DailyFoodService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.foods$ = this.foodService.getFoods();

    this.foods$.subscribe(foods => {
      this.originalFoods$.next(foods);
    });

    this.filteredFoods$ = combineLatest([
      this.originalFoods$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([foods, searchTerm]) => {
        if (!searchTerm) return foods;
        searchTerm = searchTerm.toLowerCase().trim();
        
        return foods.filter(food => 
          food.name.toLowerCase().includes(searchTerm) || 
          (food.name && food.name.toLowerCase().includes(searchTerm))
        );
      })
    );
  }

  async addToToday(food: Food) {
    await this.dailyFoodService.addToToday(food);
  }
}
