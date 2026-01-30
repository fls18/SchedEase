
import React, { useState } from 'react';
import { Subject, Section, TimeSlot, DayOfWeek, DAYS, TIME_OPTIONS } from '../types';

interface CourseDetailModalProps {
  subject: Subject;
  section: Section;
  onClose: () => void;
  onUpdate: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onRemoveFromSchedule: (subjectId: string) => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ 
  subject, 
  section, 
  onClose, 
  onUpdate, 
  onDelete, 
  onRemoveFromSchedule 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [credits, setCredits] = useState(subject.credits.toString());
  const [notes, setNotes] = useState(subject.notes || '');
  
  const handleUpdate = () => {
    onUpdate({
      ...subject,
      name,
      credits: Number(credits),
      notes: notes.trim() || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800">
              {isEditing ? '과목 정보 수정' : '수업 정보'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">과목명</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">학점</label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">비고</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${section.color.split(' ')[0]} flex items-center justify-center border-2 ${section.color.split(' ')[1]}`}>
                  <span className="text-xl font-black">{subject.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{subject.name}</h3>
                  <p className="text-slate-500 text-sm">
                    {section.label}분반 • {subject.credits}학점 
                    {subject.notes && <span className="ml-2 text-indigo-500 font-medium">({subject.notes})</span>}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">수업 일정</h4>
                {section.timeSlots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      {slot.day}
                    </div>
                    <span className="text-slate-700 font-medium">{slot.startTime} ~ {slot.endTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleUpdate} className="flex-grow bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100">저장</button>
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100">취소</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onRemoveFromSchedule(subject.id);
                  onClose();
                }}
                className="flex-grow bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-900 shadow-lg"
              >
                시간표에서 제거
              </button>
              <button onClick={() => setIsEditing(true)} className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100">수정</button>
              <button 
                onClick={() => { if(confirm('과목 전체를 보관함에서 삭제할까요?')) { onDelete(subject.id); onClose(); } }}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
