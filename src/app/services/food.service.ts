import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';
import { DailyFood } from '../models/daily-food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private firestore: Firestore) {}

  addFood(food: Food) {
    const foodCollection = collection(this.firestore, 'foods');
    return addDoc(foodCollection, food);
  }

  getFoods(): Observable<Food[]> {
    const foodCollection = collection(this.firestore, 'foods');
    return collectionData(foodCollection, { idField: 'id' }) as Observable<Food[]>;
  }

  getFoodsByDate(date: string): Observable<Food[]> {
    const foodCollection = collection(this.firestore, 'foods');
    const todayQuery = query(foodCollection, where('date', '==', date));
    return collectionData(todayQuery, { idField: 'id' }) as Observable<Food[]>;
  }

  deleteFood(id: string) {
    const foodDoc = doc(this.firestore, 'foods', id);
    return deleteDoc(foodDoc);
  }

  updateFood(id: string, food: Partial<Food>) {
    const foodDoc = doc(this.firestore, 'foods', id);
    return updateDoc(foodDoc, food);
  }

  getFoodsForUser(userId: string): Observable<Food[]> {
    const foodsRef = collection(this.firestore, 'foods');
    const q = query(foodsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Food[]>;
  }

  getFoodsForUserByDate(userId: string, date: string): Observable<Food[]> {
    const foodsRef = collection(this.firestore, 'foods');
    const q = query(
      foodsRef,
      where('userId', '==', userId),
      where('date', '==', date)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Food[]>;
  }

  async getFoodsByIds(ids: string[]): Promise<Food[]> {
    const promises = ids.map(async id => {
      const foodDocRef = doc(this.firestore, 'foods', id);
      const foodSnap = await getDoc(foodDocRef);
      const data = foodSnap.data();
      
      if (!foodSnap.exists() || !data) return null;
  
      return {
        ...(data as Omit<Food, 'id'>),
        id
      } as Food;
    });
  
    const results = await Promise.all(promises);
    return results.filter((food): food is Food => food !== null);
  }

  getWeeklyDailyFoods(userId: string) {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
  
    const start = weekAgo.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];
  
    const foodsCollection = collection(this.firestore, 'dailyFoods');
    const q = query(
      foodsCollection,
      where('userId', '==', userId),
      where('date', '>=', start),
      where('date', '<=', end)
    );
  
    return collectionData(q, { idField: 'id' }) as Observable<DailyFood[]>;
  }
}

