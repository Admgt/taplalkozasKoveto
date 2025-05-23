import { Component } from '@angular/core';
import { UserPreferences } from '../../models/user-preferences.model';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TargetWeightSetterComponent } from "../target-weight-setter/target-weight-setter.component";
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';
import { ThemeService } from '../../services/theme.service';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule, TargetWeightSetterComponent, UnitConversionPipe, MatCardModule, MatExpansionModule, MatFormFieldModule, MatOptionModule, MatDividerModule, MatProgressBarModule,
      MatStepperModule
  ],
  templateUrl: './user-preferences.component.html',
  styleUrl: './user-preferences.component.scss'
})
export class UserPreferencesComponent {
  user: User = {
    uid: '',
    email: '',
    displayName: 'Teszt Elek',
    currentWeight: 0
  };

  preferences: UserPreferences = {
    userId: '',
    unit: 'metric',
    theme: 'light',
    gender: 'man',
    targetWeight: 80,
    currentWeight: 70
  };

  constructor(private userPreferencesService: UserPreferencesService, private authService: AuthService, private themeService: ThemeService, private firestore: Firestore) {}

  async ngOnInit() {
    const authUser = getAuth().currentUser;
    if (!authUser) return;

    this.user.uid = authUser.uid;
    this.user.email = authUser.email ?? '';
    this.preferences.userId = authUser.uid;

    const existingPrefs = await this.userPreferencesService.getPreferences(authUser.uid);
    if (existingPrefs) {
      this.preferences = existingPrefs;
    }

  const userData = await this.authService.getUserData(authUser.uid);
  if (userData) {
    this.user = { ...this.user, ...userData };
  }
  }

  async savePreferences() {
    await this.userPreferencesService.savePreferences(this.preferences);
    await this.authService.updateUserData(this.user);
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        const userPrefRef = doc(this.firestore, 'userPreferences', user.uid);
        await setDoc(userPrefRef, this.preferences);
        this.themeService.setTheme(this.preferences.theme);
      }
    });
    alert('Beállítások mentve!');
  }

  onTargetWeightChanged(newTargetWeight: number) {
    this.preferences.targetWeight = newTargetWeight;
  }
}
