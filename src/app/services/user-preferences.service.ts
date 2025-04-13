import { Injectable } from "@angular/core";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { UserPreferences } from "../models/user-preferences.model";

@Injectable({
    providedIn: 'root'
  })
  export class UserPreferencesService {
  
    constructor(private firestore: Firestore) {}
  
    async savePreferences(prefs: UserPreferences) {
      const ref = doc(this.firestore, 'userPreferences', prefs.userId);
      return setDoc(ref, prefs);
    }
  
    async getPreferences(userId: string): Promise<UserPreferences | null> {
      const ref = doc(this.firestore, 'userPreferences', userId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() as UserPreferences : null;
    }
  }