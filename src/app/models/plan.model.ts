export interface WeeklyPlan {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  dailyActivities: DailyActivity[];
  createdAt: string;
}

export interface DailyActivity {
  id: string;
  planId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  contentType: ContentType;
  contentId: string;
  status: ActivityStatus;
  completedAt?: string;
}

export enum ContentType {
  Exercise = 'exercise',
  Meditation = 'meditation',
  Education = 'education'
}

export enum ActivityStatus {
  Pending = 'pending',
  Complete = 'complete'
}

export interface Exercise {
  id: string;
  name: Record<string, string>; // i18n
  description: Record<string, string>;
  videoUrl: string;
  category: ExerciseCategory;
  sets: number;
  reps: number;
}

export enum ExerciseCategory {
  MotorControl = 'Motor Control',
  DirectionalPreference = 'Directional Preference',
  Mobility = 'Mobility'
}

export interface Meditation {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  audioUrl: string;
  durationSeconds: number;
}

export interface Education {
  id: string;
  title: Record<string, string>;
  body: Record<string, string>;
  imageUrl: string;
}

