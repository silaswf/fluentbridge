import { BarChart3, Clock, FileText, Trophy, Users } from 'lucide-react';
import type { StudentSubmission, UserProfile } from '../../types/learning';

interface ClassAnalyticsTabProps {
  students: UserProfile[];
  submissions: StudentSubmission[];
  onDownloadStudentReport: (student: UserProfile) => void;
}

export function ClassAnalyticsTab({
  students,
  submissions,
  onDownloadStudentReport,
}: ClassAnalyticsTabProps) {
  const avgXp =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.xp, 0) / students.length)
      : 0;
  const avgStreak =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + s.streakDays, 0) / students.length,
        )
      : 0;
  const totalReviewed = submissions.filter((s) => s.status === 'reviewed').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Alunos ativos</span>
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">
            {students.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Média de XP</span>
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">
            {avgXp} XP
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>Ofensiva média · Correções</span>
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">
            {avgStreak}d · {totalReviewed}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span>Desempenho Individual &amp; Boletim Mensal em PDF</span>
        </h3>
        <div className="mt-3 divide-y divide-slate-100">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs"
            >
              <div>
                <p className="font-bold text-slate-900">{student.name}</p>
                <p className="text-slate-500">
                  {student.completedTopicIds.length} unidades · {student.xp} XP ·{' '}
                  {student.streakDays} dias seguidos
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDownloadStudentReport(student)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Boletim PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
