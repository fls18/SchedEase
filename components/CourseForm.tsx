
import React, { useState } from 'react';
import { Subject, Section, TimeSlot, DayOfWeek, DAYS, COLORS, TIME_OPTIONS } from '../types';

interface CourseFormProps {
  onAddSubject: (subject: Subject) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onAddSubject }) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('3');
  const [notes, setNotes] = useState('');
  const [sections, setSections] = useState<Partial<Section>[]>([
    { id: Math.random().toString(36).substr(2, 9), label: '01', timeSlots: [{ day: '월', startTime: '09:00', endTime: '10:30' }] }
  ]);

  const handleAddSection = () => {
    setSections([...sections, { 
      id: Math.random().toString(36).substr(2, 9), 
      label: `0${sections.length + 1}`, 
      timeSlots: [{ day: '월', startTime: '09:00', endTime: '10:30' }] 
    }]);
  };

  const handleRemoveSection = (sIdx: number) => {
    setSections(sections.filter((_, i) => i !== sIdx));
  };

  const handleSectionLabelChange = (sIdx: number, val: string) => {
    const newSections = [...sections];
    newSections[sIdx].label = val;
    setSections(newSections);
  };

  const handleAddSlot = (sIdx: number) => {
    const newSections = [...sections];
    newSections[sIdx].timeSlots = [...(newSections[sIdx].timeSlots || []), { day: '월', startTime: '09:00', endTime: '10:30' }];
    setSections(newSections);
  };

  const handleRemoveSlot = (sIdx: number, tIdx: number) => {
    const newSections = [...sections];
    newSections[sIdx].timeSlots = newSections[sIdx].timeSlots?.filter((_, i) => i !== tIdx);
    setSections(newSections);
  };

  const handleSlotChange = (sIdx: number, tIdx: number, field: keyof TimeSlot, value: string) => {
    const newSections = [...sections];
    if (newSections[sIdx].timeSlots) {
      const targetSlot = { ...newSections[sIdx].timeSlots![tIdx], [field]: value };
      
      if (field === 'startTime') {
        const startIndex = TIME_OPTIONS.indexOf(value);
        if (startIndex !== -1) {
          const endIndex = Math.min(startIndex + 3, TIME_OPTIONS.length - 1);
          targetSlot.endTime = TIME_OPTIONS[endIndex];
        }
      }
      
      newSections[sIdx].timeSlots![tIdx] = targetSlot;
    }
    setSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || sections.length === 0) return;

    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newSubject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      credits: Number(credits),
      notes: notes.trim() || undefined,
      sections: sections.map(s => ({
        id: s.id!,
        label: s.label || '01',
        timeSlots: s.timeSlots || [],
        color: baseColor
      }))
    };

    onAddSubject(newSubject);
    setName('');
    setCredits('3');
    setNotes('');
    setSections([{ id: Math.random().toString(36).substr(2, 9), label: '01', timeSlots: [{ day: '월', startTime: '09:00', endTime: '10:30' }] }]);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        과목 등록
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5">
        {/* Left: Subject Basic Info (Vertical) */}
        <div className="flex-grow space-y-3 min-w-[200px]">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">과목명</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="예: 기초수학"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">학점</label>
            <input
              required
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">비고</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="전공필수 등"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-xs hover:bg-slate-900 transition-all shadow-md mt-2"
          >
            보관함 저장
          </button>
        </div>

        {/* Vertical Divider (Hidden on mobile) */}
        <div className="hidden md:block w-px bg-slate-100 self-stretch"></div>

        {/* Right: Section Info (List) */}
        <div className="flex-[1.5] space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">분반 및 시간 설정</label>
            <button
              type="button"
              onClick={handleAddSection}
              className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors"
            >
              + 분반 추가
            </button>
          </div>

          <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">분반</span>
                    <input
                      type="text"
                      value={section.label}
                      onChange={(e) => handleSectionLabelChange(sIdx, e.target.value)}
                      className="w-10 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                  {sections.length > 1 && (
                    <button type="button" onClick={() => handleRemoveSection(sIdx)} className="text-red-400 hover:text-red-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {section.timeSlots?.map((slot, tIdx) => (
                    <div key={tIdx} className="flex gap-1.5 items-center bg-white p-1.5 rounded-md border border-slate-100">
                      <select
                        value={slot.day}
                        onChange={(e) => handleSlotChange(sIdx, tIdx, 'day', e.target.value as DayOfWeek)}
                        className="bg-transparent text-[10px] focus:outline-none font-bold text-slate-600"
                      >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <div className="flex items-center gap-1 flex-grow justify-end">
                        <select
                          value={slot.startTime}
                          onChange={(e) => handleSlotChange(sIdx, tIdx, 'startTime', e.target.value)}
                          className="bg-transparent text-[10px] focus:outline-none text-slate-500"
                        >
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-slate-300 text-[10px]">~</span>
                        <select
                          value={slot.endTime}
                          onChange={(e) => handleSlotChange(sIdx, tIdx, 'endTime', e.target.value)}
                          className="bg-transparent text-[10px] focus:outline-none text-slate-500"
                        >
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      {section.timeSlots!.length > 1 && (
                        <button type="button" onClick={() => handleRemoveSlot(sIdx, tIdx)} className="text-slate-300 hover:text-red-400 ml-1">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSlot(sIdx)}
                    className="w-full py-1 border border-dashed border-slate-200 rounded text-[9px] text-slate-400 hover:bg-white transition-colors"
                  >
                    + 시간대 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
