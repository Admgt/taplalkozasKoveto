import { Injectable } from "@angular/core";
import { addDoc, collection, Firestore } from "@angular/fire/firestore";
import { DailyCalories } from "../models/daily-calories.model";

@Injectable({
    providedIn: 'root'
  })
  export class DailyCaloriesService {
    constructor(private firestore: Firestore) {}
  
    saveDailyCalories(entry: DailyCalories) {
      const coll = collection(this.firestore, 'dailyCalories');
      return addDoc(coll, entry);
    }
  }