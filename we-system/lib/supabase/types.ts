export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ClientStatus = 'active' | 'renew' | 'expired' | 'new'
export type PlanStatus = 'draft' | 'sent'
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface Client {
  id: string
  name: string
  email: string | null
  whatsapp: string | null
  age: number | null
  weight_kg: number | null
  height_m: number | null
  goal_weight_kg: number | null
  goal: string | null
  timeline: string | null
  experience: string | null
  training_days: number | null
  gym_access: string | null
  dietary_restrictions: string | null
  injuries: string | null
  status: ClientStatus
  plan_type: string | null
  monthly_fee: number
  joined_at: string
  plan_expires_at: string | null
  notes: string | null
  quick_notes: string | null
  sex: string | null
  v3_id: string | null
  created_at: string
  updated_at: string
}

export interface WeightEntry {
  id: string
  client_id: string
  weight_kg: number
  recorded_at: string
  note: string | null
}

export interface Checkin {
  id: string
  client_id: string
  checkin_date: string
  note: string | null
  score: number | null
}

export interface Ingredient {
  food: string
  amount_g: number
  unit: string
}

export interface MealOption {
  name: string
  ingredients: Ingredient[]
  protein_g: number
  carbs_g: number
  fat_g: number
  kcal: number
}

export interface Meal {
  time: string
  options: [MealOption, MealOption, MealOption]
}

export interface DayMeals {
  cycle_level: 0 | 1 | 2
  desayuno: Meal
  merienda: Meal
  almuerzo: Meal
  cena: Meal
}

export interface NutritionPlanMeals {
  lunes: DayMeals
  martes: DayMeals
  miercoles: DayMeals
  jueves: DayMeals
  viernes: DayMeals
  sabado: DayMeals
  domingo: DayMeals
}

export interface Exercise {
  name: string
  muscle: string
  equipment: string
  sets: number
  reps: string
  rest_s: number
  weight: string
  gif_url: string
  notes: string
}

export interface TrainingDay {
  name: string
  exercises: Exercise[]
}

export interface TrainingPlanDays {
  lunes?: TrainingDay
  martes?: TrainingDay
  miercoles?: TrainingDay
  jueves?: TrainingDay
  viernes?: TrainingDay
  sabado?: TrainingDay
  domingo?: TrainingDay
}

export interface NutritionPlan {
  id: string
  client_id: string
  week_start: string | null
  kcal_target: number | null
  protein_g: number | null
  carbs_high_g: number | null
  carbs_mid_g: number | null
  carbs_low_g: number | null
  fat_g: number | null
  cycle: number[]
  meals: NutritionPlanMeals | Record<string, never>
  status: PlanStatus
  public_slug: string | null
  created_at: string
}

export interface TrainingPlan {
  id: string
  client_id: string
  week_start: string | null
  name: string | null
  days: TrainingPlanDays
  status: PlanStatus
  public_slug: string | null
  created_at: string
}

export interface Payment {
  id: string
  client_id: string
  amount: number
  method: string | null
  status: PaymentStatus
  due_date: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
}

export interface FormSubmission {
  id: string
  raw_data: Record<string, string>
  status: 'new' | 'converted'
  client_id: string | null
  created_at: string
}

export interface ClientNote {
  id: string
  client_id: string
  content: string
  category: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> }
      weight_entries: { Row: WeightEntry; Insert: Partial<WeightEntry>; Update: Partial<WeightEntry> }
      checkins: { Row: Checkin; Insert: Partial<Checkin>; Update: Partial<Checkin> }
      nutrition_plans: { Row: NutritionPlan; Insert: Partial<NutritionPlan>; Update: Partial<NutritionPlan> }
      training_plans: { Row: TrainingPlan; Insert: Partial<TrainingPlan>; Update: Partial<TrainingPlan> }
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> }
      form_submissions: { Row: FormSubmission; Insert: Partial<FormSubmission>; Update: Partial<FormSubmission> }
      client_notes: { Row: ClientNote; Insert: Partial<ClientNote>; Update: Partial<ClientNote> }
    }
  }
}
