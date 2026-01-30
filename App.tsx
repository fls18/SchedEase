
import React, { useState, useMemo, useCallback } from 'react';
import { Subject, Section, TimeSlot } from './types';
import CourseForm from './components/CourseForm';
import TimetableGrid from './components/TimetableGrid';
import CourseDetailModal from './components/CourseDetailModal';

const App: React.FC = () => {
  const [catalog, setCatalog] = useState<Subject[]>([]);
  const [schedule, setSchedule] = useState<{ [subjectId: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<{ subject: Subject; section: Section } | null>(null);

  const timeToMinutes = useCallback((time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }, []);

  const isOverlapping = useCallback((slot1: TimeSlot, slot2: TimeSlot) => {
    if (slot1.day !== slot2.day) return false;
    const start1 = timeToMinutes(slot1.startTime);
    const end1 = timeToMinutes(slot1.endTime);
    const start2 = timeToMinutes(slot2.startTime);
    const end2 = timeToMinutes(slot2.endTime);
    return start1 < end2 && start2 < end1;
  }, [timeToMinutes]);

  const scheduledCourses = useMemo(() => {
    return Object.entries(schedule).map(([subjectId, sectionId]) => {
      const subject = catalog.find(s => s.id === subjectId);
      const section = subject?.sections.find(sec => sec.id === sectionId);
      return subject && section ? { subject, section } : null;
    }).filter((item): item is { subject: Subject; section: Section } => item !== null);
  }, [schedule, catalog]);

  const handleAddSubject = useCallback((newSubject: Subject) => {
    if (catalog.some(s => s.name === newSubject.name)) {
      alert('이미 동일한 이름의 과목이 존재합니다.');
      return;
    }
    setCatalog((prev) => [...prev, newSubject]);
  }, [catalog]);

  const handleUpdateSubject = useCallback((updatedSubject: Subject) => {
    setCatalog((prev) => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  }, []);

  const handleRemoveFromSchedule = useCallback((subjectId: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      delete newSchedule[subjectId];
      return newSchedule;
    });
  }, []);

  const handleRemoveSubject = useCallback((id: string) => {
    setCatalog((prev) => prev.filter((s) => s.id !== id));
    handleRemoveFromSchedule(id);
  }, [handleRemoveFromSchedule]);

  const handleToggleSection = useCallback((subjectId: string, sectionId: string) => {
    const subject = catalog.find(s => s.id === subjectId);
    const section = subject?.sections.find(sec => sec.id === sectionId);
    if (!subject || !section) return;

    const isRemoving = schedule[subjectId] === sectionId;
    if (isRemoving) {
      handleRemoveFromSchedule(subjectId);
      return;
    }

    // Overlap Check
    for (const scheduled of scheduledCourses) {
      if (scheduled.subject.id === subjectId) continue; 
      for (const scheduledSlot of scheduled.section.timeSlots) {
        for (const targetSlot of section.timeSlots) {
          if (isOverlapping(scheduledSlot, targetSlot)) {
            alert(`시간이 겹칩니다! (${scheduled.subject.name} ${scheduled.section.label}분반과 중복)`);
            return;
          }
        }
      }
    }

    setSchedule(prev => ({ ...prev, [subjectId]: sectionId }));
  }, [catalog, schedule, scheduledCourses, isOverlapping, handleRemoveFromSchedule]);

  const totalCredits = useMemo(() => {
    return scheduledCourses.reduce((acc, curr) => acc + curr.subject.credits, 0);
  }, [scheduledCourses]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">TimeTable<span className="text-indigo-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">총 수강 학점</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{totalCredits}</span>
                <span className="text-sm font-medium text-slate-500">학점</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 pt-6">
        <div className="flex flex-col xl:flex-row gap-6">
          <aside className="w-full xl:w-[480px] flex-shrink-0 space-y-4 no-print">
            <CourseForm onAddSubject={handleAddSubject} />
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <h3 className="font-bold text-slate-700 text-sm">과목 보관함</h3>
                </div>
                <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 text-indigo-600 font-bold">{catalog.length}</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                {catalog.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-slate-200 mb-2 flex justify-center">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-400 text-xs italic">수업을 등록하여 보관함에 담아주세요.</p>
                  </div>
                ) : (
                  catalog.map((subject) => (
                    <div key={subject.id} className="p-4 space-y-3 hover:bg-slate-50/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm leading-tight">{subject.name} <span className="text-[11px] font-normal text-slate-400">({subject.credits}학점)</span></span>
                          {subject.notes && <span className="text-[10px] text-indigo-500 font-medium mt-0.5">{subject.notes}</span>}
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button 
                            onClick={() => setSelectedItem({ subject, section: subject.sections[0] })}
                            className="text-slate-300 hover:text-indigo-500 transition-colors p-1.5 rounded-md hover:bg-indigo-50"
                            title="상세 정보 / 수정"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleRemoveSubject(subject.id)} 
                            className="text-slate-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                            title="보관함에서 삭제"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {subject.sections.map((sec) => {
                          const isActive = schedule[subject.id] === sec.id;
                          return (
                            <button
                              key={sec.id}
                              onClick={() => handleToggleSection(subject.id, sec.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                isActive 
                                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                                  : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
                              }`}
                            >
                              {sec.label}분반
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <div className="flex-grow">
             <div className="flex items-center justify-between mb-3 no-print">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   주간 시간표
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                    인쇄 / PDF 저장
                  </button>
                </div>
             </div>
             <TimetableGrid 
                scheduledCourses={scheduledCourses} 
                onCourseClick={(subject, section) => setSelectedItem({ subject, section })} 
             />
          </div>
        </div>
      </main>

      {selectedItem && (
        <CourseDetailModal
          subject={selectedItem.subject}
          section={selectedItem.section}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateSubject}
          onDelete={handleRemoveSubject}
          onRemoveFromSchedule={handleRemoveFromSchedule}
        />
      )}

      <div className="xl:hidden fixed bottom-4 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50 no-print">
         <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Credits</div>
            <div className="text-xl font-black">{totalCredits} 학점</div>
         </div>
         <div className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/50">수업 {scheduledCourses.length}개</div>
      </div>
    </div>
  );
};

export default App;
