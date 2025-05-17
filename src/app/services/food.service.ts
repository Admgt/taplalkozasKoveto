import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, updateDoc, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
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

  getLatestFoods(userId: string): Observable<Food[]> {
    const foodsRef = collection(this.firestore, 'foods');
    const q = query(
      foodsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(5) 
    );
    return collectionData(q, { idField: 'id' }) as Observable<Food[]>;
  }

  getFoodsPaginated(userId: string, lastDoc?: QueryDocumentSnapshot<DocumentData> | null): Observable<{ foods: Food[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
    const foodsRef = collection(this.firestore, 'foods');
    let q;

    if (lastDoc) {
      q = query(
        foodsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'), 
        startAfter(lastDoc),
        limit(10)
      );
    } else {
      q = query(
        foodsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'), 
        limit(10)
      );
    }

    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        const foods = querySnapshot.docs.map(doc => ({
          ...(doc.data() as Omit<Food, 'id'>),
          id: doc.id
        }));
        
        const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
        
        return { foods, lastVisible };
      })
    );
  }
}

