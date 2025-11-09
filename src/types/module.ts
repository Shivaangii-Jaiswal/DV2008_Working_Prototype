export interface Module {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
}

export interface TimeSlot {
  id: string;
  moduleId: string;
  day: number; // 0-4 (Mon-Fri)
  startTime: number; // 8-18 (8am-6pm in hours)
  duration: number; // in hours
  room?: string;
}

export const MODULE_COLORS = [
  { name: 'Purple', value: 'module-purple' },
  { name: 'Teal', value: 'module-teal' },
  { name: 'Orange', value: 'module-orange' },
  { name: 'Pink', value: 'module-pink' },
  { name: 'Green', value: 'module-green' },
  { name: 'Blue', value: 'module-blue' },
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm

export interface Course {
  id: string;
  code: string;
  name: string;
  examDate?: string;
  color: string;
  location?: string;
  teachingWeeks?: string;
  credits: number;
  vacancies?: number;
  slots: {
    day: number;
    startTime: number;
    duration: number;
  }[];
}

export interface Plan {
  id: string;
  name: string;
  courseIds: string[];
  selectedSlots: Record<string, number>; // courseId -> selected slot index
}
