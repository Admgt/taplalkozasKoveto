import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddFoodComponent } from './pages/add-food/add-food.component';
import { FoodLogComponent } from './pages/food-log/food-log.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { UserPreferencesComponent } from './pages/user-preferences/user-preferences.component';

export const routes: Routes = [
    { path: 'profile', component: UserPreferencesComponent, canActivate: [authGuard] },
    { path: 'statistics', component: StatisticsComponent, canActivate: [authGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'food-log', component: FoodLogComponent, canActivate: [authGuard] },
    { path: 'add-food', component: AddFoodComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
