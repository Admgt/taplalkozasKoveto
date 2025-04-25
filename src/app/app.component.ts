import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { UserPreferences } from './models/user-preferences.model';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentUrl: string = '';

  constructor(public router: Router, private authService: AuthService, private firestore: Firestore, private themeService: ThemeService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        const userPrefRef = doc(this.firestore, 'userPreferences', user.uid);
        const userPrefSnap = await getDoc(userPrefRef);
  
        if (userPrefSnap.exists()) {
          const data = userPrefSnap.data() as UserPreferences;
          this.themeService.setTheme(data.theme || 'light');
        } else {
          this.themeService.setTheme('light');
        }
      } else {
        this.themeService.setTheme('light');
      }
    });
  }

  shouldShowNavbar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
