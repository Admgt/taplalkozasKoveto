import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';

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
}

