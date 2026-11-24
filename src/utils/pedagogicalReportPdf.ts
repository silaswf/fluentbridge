import type { LanguageCourse, UserProfile } from '../types/learning';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function downloadPedagogicalReportPdf(params: {
  student: UserProfile;
  course: LanguageCourse;
  schoolName: string;
  teacherName: string;
  teacherComment?: string;
}): boolean {
  if (typeof window === 'undefined') return false;
  const popup = window.open('', '_blank', 'width=960,height=1100');
  if (!popup) return false;

  const { student, course, schoolName, teacherName, teacherComment } = params;
  const langVocab = student.vocab.filter((c) => (c.languageCode ?? 'en') === course.code);
  const masteredCount = langVocab.filter((c) => c.strength === 'mastered').length;
  const masteryPct = langVocab.length > 0 ? Math.round((masteredCount / langVocab.length) * 100) : 0;
  const avgSkill = Math.round(
    (student.skillScores.listening +
      student.skillScores.reading +
      student.skillScores.speaking +
      student.skillScores.writing) /
      4,
  );
  const cefrLevel =
    student.recommendedLevelByLanguage?.[course.code] ??
    student.recommendedLevel ??
    'A1';

  const recentExams = (student.examAttempts ?? [])
    .filter((e) => e.languageCode === course.code)
    .slice(0, 4);

  const l = student.skillScores.listening;
  const r = student.skillScores.reading;
  const s = student.skillScores.speaking;
  const w = student.skillScores.writing;
  const pt = (val: number, dx: number, dy: number) =>
    `${100 + dx * (val / 100) * 75},${100 + dy * (val / 100) * 75}`;
  const radarPoints = [pt(l, 0, -1), pt(r, 1, 0), pt(s, 0, 1), pt(w, -1, 0)].join(' ');

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Boletim Pedagógico — ${escapeHtml(student.name)} (${escapeHtml(course.namePt)})</title>
  <style>
    @page { size: A4 portrait; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #f8fafc; }
    .sheet { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; }
    .brand { font-size: 18px; font-weight: 800; color: #116dff; }
    .meta { text-align: right; font-size: 12px; color: #475569; }
    h1 { font-size: 24px; margin: 18px 0 4px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0; }
    .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; text-align: center; }
    .kpi-v { font-size: 20px; font-weight: 800; color: #0f172a; }
    .kpi-l { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .row { display: flex; gap: 20px; align-items: center; margin: 18px 0; }
    .comment { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; font-size: 13px; line-height: 1.5; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 8px; text-align: left; }
    @media print { body { background: #fff; padding: 0; } .sheet { border: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="brand">${escapeHtml(schoolName)} · Boletim Pedagógico</div>
      <div class="meta">
        <div>Emitido em ${new Date().toLocaleDateString('pt-BR')}</div>
        <div>Docente: ${escapeHtml(teacherName)}</div>
      </div>
    </div>

    <h1>${escapeHtml(student.name)} — ${escapeHtml(course.namePt)} (${escapeHtml(cefrLevel)})</h1>
    <p style="font-size:13px;color:#475569;margin:0;">Relatório mensal de evolução nas 4 habilidades, retenção SRS e simulados.</p>

    <div class="grid">
      <div class="kpi"><div class="kpi-v">${student.completedTopicIds.length}</div><div class="kpi-l">Unidades Concluídas</div></div>
      <div class="kpi"><div class="kpi-v">${student.xp} XP</div><div class="kpi-l">Pontuação Total</div></div>
      <div class="kpi"><div class="kpi-v">${masteryPct}%</div><div class="kpi-l">Domínio SM-2</div></div>
      <div class="kpi"><div class="kpi-v">${avgSkill}%</div><div class="kpi-l">Média 4 Habilidades</div></div>
    </div>

    <div class="row">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="75" fill="#f8fafc" stroke="#cbd5e1" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#e2e8f0" />
        <line x1="100" y1="25" x2="100" y2="175" stroke="#e2e8f0" />
        <line x1="25" y1="100" x2="175" y2="100" stroke="#e2e8f0" />
        <polygon points="${radarPoints}" fill="rgba(17,109,255,0.22)" stroke="#116dff" stroke-width="2.5" />
        <text x="100" y="16" text-anchor="middle" font-size="10" font-weight="700">Listening ${l}%</text>
        <text x="192" y="103" text-anchor="end" font-size="10" font-weight="700">Reading ${r}%</text>
        <text x="100" y="194" text-anchor="middle" font-size="10" font-weight="700">Speaking ${s}%</text>
        <text x="8" y="103" text-anchor="start" font-size="10" font-weight="700">Writing ${w}%</text>
      </svg>
      <div style="flex:1;font-size:13px;line-height:1.6;">
        <div><strong>Ofensiva atual:</strong> ${student.streakDays} dias seguidos</div>
        <div><strong>Meta diária:</strong> ${student.dailyGoalMinutes} min/dia (${student.todayMinutes} min hoje)</div>
        <div><strong>Vocabulário no deck:</strong> ${langVocab.length} cards (${masteredCount} dominados)</div>
        <div><strong>Certificados emitidos:</strong> ${student.issuedCertificates.length}</div>
      </div>
    </div>

    ${recentExams.length > 0 ? `
      <h3 style="margin:18px 0 6px;font-size:14px;">Simulados Oficiais Recentes</h3>
      <table>
        <thead><tr><th>Exame</th><th>Pontuação</th><th>Nível</th><th>Data</th></tr></thead>
        <tbody>
          ${recentExams.map((e) => `<tr><td>${escapeHtml(e.examTypeId.toUpperCase())}</td><td>${escapeHtml(e.officialScoreLabel)} (${e.rawPercent}%)</td><td>${e.passed ? 'Aprovado' : 'Em evolução'}</td><td>${escapeHtml(e.completedAt.slice(0, 10))}</td></tr>`).join('')}
        </tbody>
      </table>
    ` : ''}

    <div class="comment">
      <strong>Parecer Pedagógico (${escapeHtml(teacherName)}):</strong><br/>
      ${escapeHtml(teacherComment || `${student.name} apresenta evolução consistente em ${course.namePt}, mantendo ritmo regular de prática e retenção de vocabulário.`)}
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 250); };</script>
</body>
</html>`;

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  return true;
}
