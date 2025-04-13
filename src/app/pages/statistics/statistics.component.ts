import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Food } from '../../models/food.model';
import { FoodTotals } from '../../models/food-totals.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  weeklyFoods: Food[] = [];
  totals: FoodTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Kalória (kcal)',
        backgroundColor: '#42a5f5',
      }
    ]
  };

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    const user = getAuth().currentUser;
    if (!user) return;

    this.foodService.getFoodsForUser(user.uid).subscribe(foods => {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 6);

      this.weeklyFoods = foods.filter(food => {
        const date = new Date(food.date);
        return date >= weekAgo && date <= today;
      });

      this.calculateTotals();
      this.updateChart();
    });
  }

  calculateTotals() {
    this.totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    for (let food of this.weeklyFoods) {
      this.totals.calories += food.calories;
      this.totals.protein += food.protein;
      this.totals.carbs += food.carbs;
      this.totals.fat += food.fat;
    }
  }

  updateChart() {
    const grouped: { [key: string]: number } = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      grouped[key] = 0;
    }

    for (const food of this.weeklyFoods) {
      grouped[food.date] += food.calories;
    }

    this.barChartData.labels = Object.keys(grouped);
    this.barChartData.datasets[0].data = Object.values(grouped);
  }
}
