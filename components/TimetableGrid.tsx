
import React from 'react';
import { Subject, Section, DAYS, HOURS, DayOfWeek } from '../types';

interface TimetableGridProps {
  scheduledCourses: { subject: Subject; section: Section }[];
  onCourseClick: (subject: Subject, section: Section) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ scheduledCourses, onCourseClick }) => {
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const getPosition = (day: DayOfWeek, startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const baseMinutes = 8 * 60; // 8:00 AM start

    const startRow = Math.floor((startMinutes - baseMinutes) / 30) + 2;
    const durationRows = Math.ceil((endMinutes - startMinutes) / 30);
    const colIndex = DAYS.indexOf(day) + 2;

    return {
      gridRowStart: startRow,
      gridRowEnd: startRow + durationRows,
      gridColumnStart: colIndex,
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="timetable-grid select-none relative">
        {/* Fixed Day Headers */}
        <div className="border-b border-r border-slate-100 bg-slate-50/50"></div>
        {DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center font-bold text-slate-600 border-b border-r border-slate-100 bg-slate-50/50 text-sm z-10 sticky top-0">
            {day}
          </div>
        ))}

        {/* Time Labels (Fixed on the left via grid layout) & Grid Cells */}
        {HOURS.map((hour) => (
          <React.Fragment key={hour}>
            <div className="flex items-start justify-center text-[10px] text-slate-400 pt-1 border-r border-slate-100 bg-slate-50/50 font-medium sticky left-0 z-20">
              {`${hour}:00`}
            </div>
            {DAYS.map((day) => (
              <div key={`${day}-${hour}`} className="border-b border-r border-slate-50 relative h-[30px] min-h-[30px]">
                <div className="absolute inset-0 border-b border-slate-50/30 top-1/2 pointer-events-none"></div>
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Course Blocks Overlay */}
        {scheduledCourses.map(({ subject, section }) =>
          section.timeSlots.map((slot, idx) => {
            const pos = getPosition(slot.day, slot.startTime, slot.endTime);
            return (
              <div
                key={`${section.id}-${idx}`}
                style={pos}
                onClick={() => onCourseClick(subject, section)}
                className={`mx-1 my-0.5 rounded p-2 text-[11px] font-medium border-l-4 shadow-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${section.color} z-10`}
              >
                <div>
                  <div className="font-bold truncate leading-tight">{subject.name}</div>
                  <div className="opacity-70 truncate text-[10px]">{section.label}분반</div>
                  {subject.notes && <div className="text-[9px] opacity-60 italic mt-1 truncate">{subject.notes}</div>}
                </div>
                <div className="text-[9px] opacity-60">
                  {slot.startTime}-{slot.endTime}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimetableGrid;
