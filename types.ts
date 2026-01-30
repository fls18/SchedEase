
export type DayOfWeek = '월' | '화' | '수' | '목' | '금';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface Section {
  id: string;
  label: string;
  timeSlots: TimeSlot[];
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  notes?: string; // Added notes field
  sections: Section[];
}

export const DAYS: DayOfWeek[] = ['월', '화', '수', '목', '금'];
export const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

export const TIME_OPTIONS = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export const COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-red-100 border-red-300 text-red-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-teal-100 border-teal-300 text-teal-800',
];
