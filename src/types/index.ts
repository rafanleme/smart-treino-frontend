export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  total_xp?: number;
  level?: number;
  xp_to_next_level?: number;
  streak?: UserStreak;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export type MuscleGroup =
  | 'chest' | 'back' | 'legs' | 'shoulders' | 'biceps'
  | 'triceps' | 'abs' | 'cardio' | 'glutes' | 'forearms' | 'calves';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'machine' | 'cable'
  | 'bodyweight' | 'kettlebell' | 'band' | 'other';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType = 'strength' | 'cardio' | 'stretching' | 'plyometrics';

export interface Exercise {
  id: number;
  name: string;
  name_pt: string;
  description: string | null;
  description_pt: string | null;
  muscle_group: MuscleGroup;
  secondary_muscles: MuscleGroup[] | null;
  equipment: Equipment;
  difficulty: Difficulty;
  exercise_type: ExerciseType;
  image_url: string | null;
  is_custom: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  muscle_group?: MuscleGroup;
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
  difficulty?: Difficulty;
  exercise_type?: ExerciseType;
  exerciseType?: ExerciseType;
  search?: string;
  include_custom?: boolean;
  includeCustom?: boolean;
  per_page?: number;
  perPage?: number;
  page?: number;
}

export interface WorkoutExercise {
  id: number;
  workout_id: number;
  exercise_id: number;
  exercise?: Exercise;
  order: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  is_ai_generated: boolean;
  estimated_duration_min: number | null;
  workout_exercises?: WorkoutExercise[];
  exercises_count?: number;
  created_at: string;
  updated_at: string;
}

export type TrainingSessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type SessionExerciseStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface SessionSet {
  id: number;
  session_exercise_id: number;
  set_number: number;
  reps_target: number | null;
  reps_completed: number | null;
  load_kg: number | null;
  rest_seconds: number | null;
  rpe: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionExercise {
  id: number;
  training_session_id: number;
  exercise_id: number;
  exercise_name: string;
  order: number;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  started_at: string | null;
  finished_at: string | null;
  status: SessionExerciseStatus;
  created_at: string;
  updated_at: string;
  exercise?: Exercise;
  session_sets?: SessionSet[];
}

export interface TrainingSessionSummary {
  total_exercises: number;
  completed_exercises: number;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
  personal_records: number;
}

export interface TrainingSession {
  id: number;
  user_id: number;
  workout_id: number | null;
  workout_name: string | null;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  status: TrainingSessionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  session_exercises?: SessionExercise[];
  summary?: TrainingSessionSummary;
  exercises_count?: number;
}

export interface PreviousLoad {
  load_kg: number;
  reps: number;
  date: string;
}

export interface PhysicalAssessment {
  id: number;
  user_id: number;
  assessed_at: string;
  weight_kg: number | null;
  height_cm: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  left_arm_cm: number | null;
  right_arm_cm: number | null;
  left_thigh_cm: number | null;
  right_thigh_cm: number | null;
  left_calf_cm: number | null;
  right_calf_cm: number | null;
  neck_cm: number | null;
  shoulder_cm: number | null;
  forearm_cm: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentDelta {
  from: number;
  to: number;
  delta: number;
  delta_pct: number;
}

export interface AssessmentComparison {
  from: PhysicalAssessment;
  to: PhysicalAssessment;
  deltas: Record<string, AssessmentDelta>;
}

export interface ProgressDataPoint {
  date: string;
  value: number;
}

// Gamification types
export type AchievementCategory = 'consistency' | 'strength' | 'assessment' | 'milestone';

export interface Achievement {
  id: number;
  key: string;
  name: string;
  name_pt: string;
  description: string;
  description_pt: string;
  icon: string;
  category: AchievementCategory;
  threshold_value: number | null;
  xp_reward: number;
  unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
}

export interface PersonalRecord {
  id: number;
  exercise: {
    id: number;
    name: string;
    name_pt: string;
    muscle_group: MuscleGroup;
  };
  load_kg: number;
  reps: number;
  achieved_at: string;
  created_at: string;
}

export interface WeeklyVolume {
  week: string;
  volume_kg: number;
}

export interface FavoriteExercise {
  id: number;
  name_pt: string;
  times_performed: number;
}

export interface DashboardStats {
  total_sessions: number;
  total_duration_hours: number;
  total_volume_kg: number;
  sessions_this_week: number;
  sessions_this_month: number;
  favorite_exercise: FavoriteExercise | null;
  current_streak: number;
  total_xp: number;
  level: number;
  xp_to_next_level: number;
  recent_prs: number;
  weekly_volume: WeeklyVolume[];
}
