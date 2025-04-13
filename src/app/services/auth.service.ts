import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { User as AppUser } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const userData: AppUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: userCredential.user.displayName || '',
      currentWeight: 0
    };
    await setDoc(doc(this.firestore, 'users', userData.uid), userData);
    return userCredential;
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return authState(this.auth);
  }

  async getUserData(uid: string): Promise<AppUser | null> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as AppUser) : null;
  }

  async updateUserData(user: AppUser): Promise<void> {
    const userRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, { ...user });
    } else {
      await setDoc(userRef, { ...user });
    }
  }
}
