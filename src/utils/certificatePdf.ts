/**
 * @file src/utils/certificatePdf.ts
 * @description Utilitário certificatePdf da camada de lógica do FluentBridge.
 * @exports downloadCertificatePdf
 */
import type { CEFRLevel, CertificateRecord } from '../types/learning';

const LEVEL_NAMES: Record<CEFRLevel, string> = {
  A1: 'Iniciante (Breakthrough)',
  A2: 'Básico (Waystage)',
  B1: 'Intermediário (Threshold)',
  B2: 'Intermediário Avançado (Vantage)',
  C1: 'Proficiência Operacional Eficaz (Advanced)',
};

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function downloadCertificatePdf(
  cert: CertificateRecord,
  schoolName: string,
  teacherName: string,
  className?: string,
): boolean {
  if (typeof window === 'undefined') return false;

  const popup = window.open('', '_blank', 'width=1024,height=740');
  if (!popup) return false;

  const formattedDate = new Date(cert.issuedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Certificado ${escapeHtml(cert.level)} — ${escapeHtml(cert.studentName)}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .sheet {
      width: 100%;
      max-width: 980px;
      background: #ffffff;
      border: 10px solid #1e3a8a;
      outline: 2px solid #93c5fd;
      outline-offset: -18px;
      border-radius: 16px;
      padding: 44px 54px;
      position: relative;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 18px;
    }
    .brand { font-size: 20px; font-weight: 800; color: #116dff; letter-spacing: -0.02em; }
    .badge {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 6px 14px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 13px;
    }
    .center { text-align: center; padding: 28px 0 22px; }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }
    h1 {
      margin: 10px 0 6px;
      font-size: 38px;
      font-weight: 800;
      color: #0f172a;
    }
    .student {
      margin: 16px 0 10px;
      font-size: 34px;
      font-weight: 800;
      color: #116dff;
      border-bottom: 2px solid #dbeafe;
      display: inline-block;
      padding: 0 24px 6px;
    }
    .desc {
      max-width: 680px;
      margin: 12px auto 0;
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
    }
    .skills {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 26px 0;
    }
    .skill-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .skill-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .skill-val { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 26px;
      padding-top: 18px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #475569;
    }
    .sig { text-align: center; min-width: 220px; }
    .sig-line { border-top: 1.5px solid #334155; padding-top: 6px; font-weight: 700; color: #0f172a; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div class="brand">${escapeHtml(schoolName)}</div>
      <div class="badge">CEFR NÍVEL ${escapeHtml(cert.level)} · ${escapeHtml(LEVEL_NAMES[cert.level])}</div>
    </div>

    <div class="center">
      <div class="eyebrow">Certificado Oficial de Conclusão</div>
      <h1>Língua Inglesa · 4 Habilidades</h1>
      <p class="desc">Certificamos que</p>
      <div class="student">${escapeHtml(cert.studentName)}</div>
      <p class="desc">
        concluiu com êxito todas as unidades e avaliações práticas do nível
        <strong>${escapeHtml(cert.level)} — ${escapeHtml(LEVEL_NAMES[cert.level])}</strong>${
    className ? ` na turma <strong>${escapeHtml(className)}</strong>` : ''
  }, desenvolvendo competências integradas de compreensão auditiva, leitura, fala e escrita (média geral: <strong>${cert.avgScore}%</strong> · carga estimada: <strong>${cert.totalHours}h</strong>).
      </p>
    </div>

    <div class="skills">
      <div class="skill-box">
        <div class="skill-label">Listening · Ouvir</div>
        <div class="skill-val">${cert.skillScores.listening}%</div>
      </div>
      <div class="skill-box">
        <div class="skill-label">Reading · Ler</div>
        <div class="skill-val">${cert.skillScores.reading}%</div>
      </div>
      <div class="skill-box">
        <div class="skill-label">Speaking · Falar</div>
        <div class="skill-val">${cert.skillScores.speaking}%</div>
      </div>
      <div class="skill-box">
        <div class="skill-label">Writing · Escrever</div>
        <div class="skill-val">${cert.skillScores.writing}%</div>
      </div>
    </div>

    <div class="footer">
      <div>
        <div><strong>Emitido em:</strong> ${escapeHtml(formattedDate)}</div>
        <div><strong>Código de verificação:</strong> ${escapeHtml(cert.verificationCode)}</div>
      </div>
      <div class="sig">
        <div class="sig-line">${escapeHtml(cert.issuedBy || teacherName)}</div>
        <div>Coordenação Pedagógica · ${escapeHtml(schoolName)}</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 250); };
  </script>
</body>
</html>`;

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  return true;
}
