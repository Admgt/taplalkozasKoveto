import { Component, OnInit, ViewChild } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FoodTotals } from '../../models/food-totals.model';
import { DailyFoodService } from '../../services/daily-food.service';
import { DailyFood } from '../../models/daily-food.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  weeklyFoods: DailyFood[] = [];
  totals: FoodTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private foodService: FoodService, private dailyFoodService: DailyFoodService) {}

  ngOnInit() {
    const user = getAuth().currentUser;
    if (!user) return;

    this.foodService.getWeeklyDailyFoods(user.uid).subscribe(dailyFoods => {
      this.weeklyFoods = dailyFoods;
      this.calculateTotals();
      this.updateChart();
    });
  }

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

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(224, 224, 224, 0.3)' 
        }
      },
      y: {
        grid: {
          color: 'rgba(224, 224, 224, 0.3)' 
        },
        beginAtZero: true
      }
    }
  };

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
      if (grouped.hasOwnProperty(food.date)) {
        grouped[food.date] += food.calories;
      }
    }

    this.barChartData.labels = Object.keys(grouped);
    this.barChartData.datasets[0].data = Object.values(grouped);

    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      }
    }, 0);
  }
}
