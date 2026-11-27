/**
 * @file src/utils/__tests__/tenantEngine.test.ts
 * @description Testes unitários do motor multi-tenancy: isolamento estrito entre escolas (zero vazamento), coordenação do Master Admin, alocação segura e troca de professor na mesma escola.
 * @exports none
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/platformDefaults';
import type { PlatformState, SchoolTenant, UserProfile } from '../../types/learning';
import {
  allocateUserToSchool,
  DEFAULT_SCHOOL_ID,
  detectSchoolFromUrl,
  findSchoolByInviteCode,
  getSchoolClasses,
  getSchoolTeachers,
  reassignStudentTeacherInSchool,
  scopePlatformStateForUser,
} from '../tenantEngine';

function makeUser(overrides: Partial<UserProfile>): UserProfile {
  const base = DEFAULT_PLATFORM_STATE.users[0];
  return {
    ...base,
    id: overrides.id ?? 'u-1',
    name: overrides.name ?? 'User',
    email: overrides.email ?? 'user@example.com',
    role: overrides.role ?? 'student',
    isMasterAdmin: overrides.isMasterAdmin ?? false,
    schoolId: overrides.schoolId ?? DEFAULT_SCHOOL_ID,
    ...overrides,
  };
}

const SCHOOL_ALPHA: SchoolTenant = {
  id: 'school-alpha',
  slug: 'alpha',
  name: 'Escola Alpha',
  inviteCode: 'ESCOLA-ALPHA-1001',
  status: 'active',
  createdAt: '2026-11-27',
};

const SCHOOL_BETA: SchoolTenant = {
  id: 'school-beta',
  slug: 'beta',
  name: 'Escola Beta',
  inviteCode: 'ESCOLA-BETA-2002',
  status: 'active',
  createdAt: '2026-11-27',
};

function makeMultiTenantState(): PlatformState {
  const master = makeUser({
    id: 'master-1',
    email: 'silaswf@gmail.com',
    role: 'teacher',
    isMasterAdmin: true,
    schoolId: DEFAULT_SCHOOL_ID,
  });
  const profAlpha1 = makeUser({
    id: 'prof-a1',
    name: 'Prof. Ana Alpha',
    email: 'ana@alpha.com',
    role: 'teacher',
    schoolId: 'school-alpha',
  });
  const profAlpha2 = makeUser({
    id: 'prof-a2',
    name: 'Prof. Bruno Alpha',
    email: 'bruno@alpha.com',
    role: 'teacher',
    schoolId: 'school-alpha',
  });
  const stuAlpha = makeUser({
    id: 'stu-a1',
    name: 'Aluno Alpha',
    email: 'aluno@alpha.com',
    role: 'student',
    schoolId: 'school-alpha',
    assignedTeacherId: 'prof-a1',
    xp: 450,
    completedTopicIds: ['en-a1-1', 'en-a1-2'],
  });
  const profBeta = makeUser({
    id: 'prof-b1',
    name: 'Prof. Carla Beta',
    email: 'carla@beta.com',
    role: 'teacher',
    schoolId: 'school-beta',
  });
  const stuBeta = makeUser({
    id: 'stu-b1',
    name: 'Aluno Beta',
    email: 'aluno@beta.com',
    role: 'student',
    schoolId: 'school-beta',
    assignedTeacherId: 'prof-b1',
  });

  return {
    ...DEFAULT_PLATFORM_STATE,
    schools: [SCHOOL_ALPHA, SCHOOL_BETA],
    users: [master, profAlpha1, profAlpha2, stuAlpha, profBeta, stuBeta],
    classes: [
      {
        id: 'cls-a1',
        schoolId: 'school-alpha',
        name: 'Turma Alpha A1',
        code: 'ALPHA-A1',
        level: 'A1',
        schedule: 'Seg 19h',
        description: 'Turma Alpha',
        teacherId: 'prof-a1',
        createdAt: '2026-11-27',
      },
      {
        id: 'cls-b1',
        schoolId: 'school-beta',
        name: 'Turma Beta B1',
        code: 'BETA-B1',
        level: 'B1',
        schedule: 'Ter 20h',
        description: 'Turma Beta',
        teacherId: 'prof-b1',
        createdAt: '2026-11-27',
      },
    ],
    submissions: [
      {
        id: 'sub-a1',
        schoolId: 'school-alpha',
        type: 'writing',
        studentId: 'stu-a1',
        studentName: 'Aluno Alpha',
        teacherId: 'prof-a1',
        topicId: 'en-a1-1',
        topicTitle: 'Greetings',
        promptPt: 'Write',
        responseText: 'Hello',
        createdAt: '27/11',
        status: 'pending',
      },
      {
        id: 'sub-b1',
        schoolId: 'school-beta',
        type: 'writing',
        studentId: 'stu-b1',
        studentName: 'Aluno Beta',
        teacherId: 'prof-b1',
        topicId: 'en-b1-1',
        topicTitle: 'Travel',
        promptPt: 'Write',
        responseText: 'Airport',
        createdAt: '27/11',
        status: 'pending',
      },
    ],
    communityPosts: [
      {
        id: 'post-a1',
        schoolId: 'school-alpha',
        languageCode: 'en',
        authorId: 'stu-a1',
        authorName: 'Aluno Alpha',
        authorAvatarColor: '#116DFF',
        authorRole: 'student',
        level: 'A1',
        category: 'question',
        title: 'Dúvida Alpha',
        body: 'Pergunta Alpha',
        likes: [],
        replies: [],
        createdAt: '2026-11-27',
      },
      {
        id: 'post-b1',
        schoolId: 'school-beta',
        languageCode: 'en',
        authorId: 'stu-b1',
        authorName: 'Aluno Beta',
        authorAvatarColor: '#0D9488',
        authorRole: 'student',
        level: 'B1',
        category: 'question',
        title: 'Dúvida Beta',
        body: 'Pergunta Beta',
        likes: [],
        replies: [],
        createdAt: '2026-11-27',
      },
    ],
  };
}

describe('tenantEngine multi-tenancy isolation', () => {
  it('guarantees zero cross-school data leakage for teachers and students', () => {
    const state = makeMultiTenantState();
    const profAlpha = state.users.find((u) => u.id === 'prof-a1')!;
    const stuBeta = state.users.find((u) => u.id === 'stu-b1')!;

    const scopedAlpha = scopePlatformStateForUser(state, profAlpha);
    expect(scopedAlpha.schoolName).toBe('Escola Alpha');
    expect(scopedAlpha.users.map((u) => u.id).sort()).toEqual([
      'prof-a1',
      'prof-a2',
      'stu-a1',
    ]);
    expect(scopedAlpha.classes.map((c) => c.id)).toEqual(['cls-a1']);
    expect(scopedAlpha.submissions.map((s) => s.id)).toEqual(['sub-a1']);
    expect(scopedAlpha.communityPosts?.map((p) => p.id)).toEqual(['post-a1']);

    const scopedBeta = scopePlatformStateForUser(state, stuBeta);
    expect(scopedBeta.schoolName).toBe('Escola Beta');
    expect(scopedBeta.users.map((u) => u.id).sort()).toEqual([
      'prof-b1',
      'stu-b1',
    ]);
    expect(scopedBeta.classes.map((c) => c.id)).toEqual(['cls-b1']);
    expect(scopedBeta.submissions.map((s) => s.id)).toEqual(['sub-b1']);
    expect(scopedBeta.communityPosts?.map((p) => p.id)).toEqual(['post-b1']);
  });

  it('allows Master Admin to see all schools globally or filter to one tenant', () => {
    const state = makeMultiTenantState();
    const master = state.users.find((u) => u.id === 'master-1')!;

    const globalView = scopePlatformStateForUser(state, master, 'ALL');
    expect(globalView.users).toHaveLength(6);
    expect(globalView.classes).toHaveLength(2);

    const alphaOnly = scopePlatformStateForUser(state, master, 'school-alpha');
    expect(alphaOnly.classes.map((c) => c.id)).toEqual(['cls-a1']);
    expect(alphaOnly.submissions.map((s) => s.id)).toEqual(['sub-a1']);
    expect(alphaOnly.users.some((u) => u.id === 'stu-b1')).toBe(false);
  });

  it('supports switching teachers inside the same school while preserving XP & progress and blocking cross-school teachers', () => {
    const state = makeMultiTenantState();

    // Valid switch within Escola Alpha (prof-a1 -> prof-a2)
    const okSwitch = reassignStudentTeacherInSchool(state.users, 'stu-a1', 'prof-a2');
    expect(okSwitch.ok).toBe(true);
    const updatedStu = okSwitch.users.find((u) => u.id === 'stu-a1')!;
    expect(updatedStu.schoolId).toBe('school-alpha');
    expect(updatedStu.assignedTeacherId).toBe('prof-a2');
    expect(updatedStu.xp).toBe(450);
    expect(updatedStu.completedTopicIds).toEqual(['en-a1-1', 'en-a1-2']);

    // Cross-school switch (stu-a1 in Alpha -> prof-b1 in Beta) MUST be rejected
    const badSwitch = reassignStudentTeacherInSchool(state.users, 'stu-a1', 'prof-b1');
    expect(badSwitch.ok).toBe(false);
    expect(badSwitch.error).toContain('outra escola');
  });

  it('clears old-school teacher/class links when allocating a student to another school', () => {
    const state = makeMultiTenantState();
    const movedUsers = allocateUserToSchool(
      state.users,
      state.classes,
      'stu-a1',
      'school-beta',
    );
    const movedStu = movedUsers.find((u) => u.id === 'stu-a1')!;
    expect(movedStu.schoolId).toBe('school-beta');
    expect(movedStu.assignedTeacherId).toBeUndefined();
    expect(movedStu.classId).toBeUndefined();
    expect(movedStu.enrollmentType).toBe('independent');
  });

  it('scopes teachers/classes by school and resolves ?escola=slug and invite codes', () => {
    const state = makeMultiTenantState();
    expect(getSchoolTeachers(state.users, 'school-alpha').map((t) => t.id)).toEqual([
      'prof-a1',
      'prof-a2',
    ]);
    expect(getSchoolClasses(state.classes, 'school-beta').map((c) => c.id)).toEqual([
      'cls-b1',
    ]);
    expect(detectSchoolFromUrl(state.schools, '?escola=alpha')?.id).toBe('school-alpha');
    expect(findSchoolByInviteCode(state.schools, 'escola-beta-2002')?.id).toBe('school-beta');
  });
});
