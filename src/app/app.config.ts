import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"nutrition-tracker-ff982","appId":"1:155451344679:web:2bd2b5d44e26cbdd5e4b02","storageBucket":"nutrition-tracker-ff982.firebasestorage.app","apiKey":"AIzaSyAXYuXW3UtCxow60FYUIJydH8mgRSrnl3I","authDomain":"nutrition-tracker-ff982.firebaseapp.com","messagingSenderId":"155451344679"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
