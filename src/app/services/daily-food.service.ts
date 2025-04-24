import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData } from '@angular/fire/firestore';
import { DailyFood } from '../models/daily-food.model';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { Food } from '../models/food.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DailyFoodService {
  private foodAddedSource = new Subject<void>();
  foodAdded$ = this.foodAddedSource.asObservable();

  constructor(private firestore: Firestore, private authService: AuthService) {}

  addDailyFood(entry: DailyFood) {
    const ref = collection(this.firestore, 'dailyFoods');
    return addDoc(ref, entry);
  }

  getDailyFoodsByDate(userId: string, date: string): Observable<DailyFood[]> {
    const ref = collection(this.firestore, 'dailyFoods');
    const q = query(ref, where('userId', '==', userId), where('date', '==', date));
    return collectionData(q, { idField: 'id' }) as Observable<DailyFood[]>;
  }

  async addToToday(food: Food) {
    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (!user || !food.id) {
        console.error('Felhasználó vagy étel ID nem található');
        return;
      }
    
      const today = new Date().toISOString().split('T')[0];
    
      await this.addDailyFood({
        userId: user.uid,
        date: today,
        foodId: food.id, 
        name: food.name || '',
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        servingSize: food.servingSize || 0 
      });
    
      console.log('Étel sikeresen hozzáadva:', food.name);
      this.foodAddedSource.next();
      alert('Hozzáadva a mai naphoz!');
      return true;
    } catch (error) {
      console.error('Hiba az étel hozzáadásakor:', error);
      alert('Hiba történt a hozzáadás során.');
      return false;
    }
  }
}
