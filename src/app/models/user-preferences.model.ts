export interface UserPreferences {
    userId: string;
    unit: 'metric' | 'imperial';
    theme: 'light' | 'dark';
    gender: string;
    targetWeight: number;
    currentWeight: number;
  }