export enum JobType {
  MostlySitting = 'Mostly Sitting',
  MostlyStanding = 'Mostly Standing',
  PhysicallyActive = 'Physically Active',
  ManualLabor = 'Manual Labor'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active'
}

export enum Language {
  English = 'en',
  Persian = 'fa',
  Arabic = 'ar'
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'Prefer Not to Say'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  age: number;
  countryName: string;
  backPainYears: number;
  jobType: JobType;
  weeklyActivityLevel: ActivityLevel;
  language: Language;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  countryName: string;
  backPainYears: number;
  jobType: JobType;
  weeklyActivityLevel: ActivityLevel;
}

