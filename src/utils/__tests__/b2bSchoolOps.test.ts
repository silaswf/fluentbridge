/**
 * @file src/utils/__tests__/b2bSchoolOps.test.ts
 * @description Testes unitários para operações B2B multi-escola: parser CSV de alunos, gerador de QR Code SVG e isolamento estrito do coordenador escolar (isSchoolAdmin).
 * @exports (test suite)
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/platformDefaults';
import type { PlatformState, SchoolTenant, UserProfile } from '../../types/learning';
import { generateSchoolQrSvg, parseStudentsCsv } from '../qrCodeSvg';
import {
  DEFAULT_SCHOOL_ID,
  reassignStudentTeacherInSchool,
  scopePlatformStateForUser,
} from '../tenantEngine';

function makeUser(overrides: Partial<UserProfile>): UserProfile {
  const base = DEFAULT_PLATFORM_STATE.users[0];
  return {
    ...base,
    id: overrides.id ?? 'u-1',
    schoolId: overrides.schoolId ?? DEFAULT_SCHOOL_ID,
    name: overrides.name ?? 'Usuário Teste',
    email: overrides.email ?? 'user@test.com',
    role: overrides.role ?? 'student',
    isMasterAdmin: overrides.isMasterAdmin ?? false,
    ...overrides,
  };
}

describe('parseStudentsCsv', () => {
  it('faz parse de CSV com cabeçalho, vírgula e ponto-e-vírgula ignorando linhas inválidas', () => {
    const csv = [
      'Nome,Email,Turma',
      'Ana Silva, ANA@ESCOLA.COM , B1-MANHA',
      '"Souza, Lucas",lucas@escola.com,',
      'Linha Sem Email,sem-arroba,A1',
      '',
    ].join('\n');

    const rows = parseStudentsCsv(csv);
    expect(rows).toEqual([
      { name: 'Ana Silva', email: 'ana@escola.com', classCode: 'B1-MANHA' },
      { name: 'Souza, Lucas', email: 'lucas@escola.com' },
    ]);

    const semicolonCsv = 'Nome;Email;Turma\nPedro;pedro@alpha.edu;A2';
    expect(parseStudentsCsv(semicolonCsv)).toEqual([
      { name: 'Pedro', email: 'pedro@alpha.edu', classCode: 'A2' },
    ]);
  });
});

describe('generateSchoolQrSvg', () => {
  it('gera SVG determinístico, distinto por URL e com label escapado em XML', () => {
    const svgA1 = generateSchoolQrSvg('https://fluentbridge.app/?escola=alpha', 'Alpha & Co <1>');
    const svgA2 = generateSchoolQrSvg('https://fluentbridge.app/?escola=alpha', 'Alpha & Co <1>');
    const svgB = generateSchoolQrSvg('https://fluentbridge.app/?escola=beta', 'Beta');

    expect(svgA1).toContain('<svg ');
    expect(svgA1).toContain('</svg>');
    expect(svgA1).toBe(svgA2);
    expect(svgA1).not.toBe(svgB);
    expect(svgA1).toContain('Alpha &amp; Co &lt;1&gt;');
  });
});

describe('Coordinator (isSchoolAdmin) isolation', () => {
  const schools: SchoolTenant[] = [
    {
      id: 'school-alpha',
      slug: 'alpha',
      name: 'Escola Alpha',
      inviteCode: 'ESCOLA-ALPHA',
      status: 'active',
      createdAt: '2026-11-01T00:00:00.000Z',
    },
    {
      id: 'school-beta',
      slug: 'beta',
      name: 'Escola Beta',
      inviteCode: 'ESCOLA-BETA',
      status: 'active',
      createdAt: '2026-11-01T00:00:00.000Z',
    },
  ];

  const coordAlpha = makeUser({
    id: 'coord-a',
    schoolId: 'school-alpha',
    role: 'teacher',
    isSchoolAdmin: true,
    email: 'coord@alpha.com',
  });
  const teacherAlpha = makeUser({
    id: 't-a',
    schoolId: 'school-alpha',
    role: 'teacher',
    email: 'prof@alpha.com',
  });
  const studentAlpha = makeUser({
    id: 's-a',
    schoolId: 'school-alpha',
    role: 'student',
    email: 'aluno@alpha.com',
  });
  const teacherBeta = makeUser({
    id: 't-b',
    schoolId: 'school-beta',
    role: 'teacher',
    email: 'prof@beta.com',
  });
  const studentBeta = makeUser({
    id: 's-b',
    schoolId: 'school-beta',
    role: 'student',
    email: 'aluno@beta.com',
  });

  it('isola o estado da plataforma apenas para a escola do coordenador', () => {
    const state: PlatformState = {
      schoolName: 'FluentBridge',
      schools,
      teacherName: 'Prof',
      currentUserId: coordAlpha.id,
      users: [coordAlpha, teacherAlpha, studentAlpha, teacherBeta, studentBeta],
      classes: [
        {
          id: 'c-a',
          schoolId: 'school-alpha',
          name: 'Turma Alpha',
          code: 'ALPHA1',
          level: 'B1',
          schedule: 'Seg/Qua 19h',
          description: 'Turma Alpha',
          teacherId: teacherAlpha.id,
          createdAt: '2026-11-01T00:00:00.000Z',
        },
        {
          id: 'c-b',
          schoolId: 'school-beta',
          name: 'Turma Beta',
          code: 'BETA1',
          level: 'A2',
          schedule: 'Ter/Qui 19h',
          description: 'Turma Beta',
          teacherId: teacherBeta.id,
          createdAt: '2026-11-01T00:00:00.000Z',
        },
      ],
      customTopics: [],
      submissions: [],
      cloudConfig: { supabaseUrl: '', supabaseAnonKey: '', geminiApiKey: '' },
    };

    const scoped = scopePlatformStateForUser(state, coordAlpha, 'ALL');
    expect(scoped.schoolName).toBe('Escola Alpha');
    expect(scoped.users.map((u) => u.id)).toEqual(['coord-a', 't-a', 's-a']);
    expect(scoped.classes.map((c) => c.id)).toEqual(['c-a']);
  });

  it('bloqueia remanejamento de aluno para professor de outra escola e permite na mesma escola', () => {
    const users = [teacherAlpha, studentAlpha, teacherBeta];

    const blocked = reassignStudentTeacherInSchool(
      users,
      studentAlpha.id,
      teacherBeta.id,
    );
    expect(blocked.ok).toBe(false);

    const allowed = reassignStudentTeacherInSchool(
      users,
      studentAlpha.id,
      teacherAlpha.id,
    );
    expect(allowed.ok).toBe(true);
    expect(
      allowed.users.find((u) => u.id === studentAlpha.id)?.assignedTeacherId,
    ).toBe(teacherAlpha.id);
  });
});
