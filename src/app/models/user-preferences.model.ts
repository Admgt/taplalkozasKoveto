export interface UserPreferences {
    userId: string;
    unit: 'metric' | 'imperial';
    theme: 'light' | 'dark';
    language: string;
    targetWeight: number;
  }