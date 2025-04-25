import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = 'light';

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.body.className = ''; 
    document.body.classList.add(`${theme}-theme`);
  }

  getTheme() {
    return this.currentTheme;
  }
}
