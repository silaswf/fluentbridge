import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/lessons';
import type { PlatformState, StudentSubmission, UserProfile } from '../../types/learning';
import { mergePlatformStates } from '../cloudSync';

function makeStudent(overrides: Partial<UserProfile>): UserProfile {
  return {
    ...DEFAULT_PLATFORM_STATE.users[0],
    id: 'stu-1',
    name: 'Aluno Teste',
    email: 'aluno@teste.com',
    role: 'student',
    isMasterAdmin: false,
    xp: 50,
    completedTopicIds: ['a1-1'],
    ...overrides,
  };
}

describe('cloudSync granular mergePlatformStates', () => {
  it('merges users, unions completedTopicIds and takes max XP without overwriting peers', () => {
    const local: PlatformState = {
      ...DEFAULT_PLATFORM_STATE,
      users: [
        DEFAULT_PLATFORM_STATE.users[0],
        makeStudent({ id: 'stu-1', email: 'a@teste.com', xp: 120, completedTopicIds: ['a1-1', 'a1-2'] }),
      ],
    };

    const remote: Partial<PlatformState> = {
      users: [
        makeStudent({ id: 'stu-1', email: 'a@teste.com', xp: 90, completedTopicIds: ['a1-1', 'a1-3'] }),
        makeStudent({ id: 'stu-2', email: 'b@teste.com', name: 'Outro Aluno', xp: 200 }),
      ],
    };

    const merged = mergePlatformStates(local, remote, 'local');
    expect(merged.users.some((u) => u.email === 'b@teste.com')).toBe(true);
    const alunoA = merged.users.find((u) => u.email === 'a@teste.com');
    expect(alunoA?.xp).toBe(120);
    expect(alunoA?.completedTopicIds).toEqual(
      expect.arrayContaining(['a1-1', 'a1-2', 'a1-3']),
    );
  });

  it('preserves reviewed teacher feedback and cross-device speaking audio attachments', () => {
    const localSub: StudentSubmission = {
      id: 'sub-1',
      type: 'speaking',
      studentId: 'stu-1',
      studentName: 'Aluno',
      topicId: 'a1-1',
      topicTitle: 'Café',
      promptPt: 'Fale',
      responseText: 'I would like coffee',
      audioDataUrl: 'data:audio/webm;base64,AAAA',
      createdAt: '23/11 11:00',
      status: 'pending',
    };
    const remoteSub: StudentSubmission = {
      ...localSub,
      audioDataUrl: undefined,
      status: 'reviewed',
      teacherFeedback: 'Excelente entonação!',
    };

    const merged = mergePlatformStates(
      { ...DEFAULT_PLATFORM_STATE, submissions: [localSub] },
      { submissions: [remoteSub] },
      'local',
    );

    expect(merged.submissions).toHaveLength(1);
    expect(merged.submissions[0].status).toBe('reviewed');
    expect(merged.submissions[0].teacherFeedback).toBe('Excelente entonação!');
    expect(merged.submissions[0].audioDataUrl).toBe('data:audio/webm;base64,AAAA');
  });

  it('respects deletion tombstones across devices', () => {
    const local: PlatformState = {
      ...DEFAULT_PLATFORM_STATE,
      deletedClassIds: ['class-deleted'],
    };
    const remote: Partial<PlatformState> = {
      classes: [
        {
          id: 'class-deleted',
          name: 'Turma Apagada',
          code: 'DEL-1',
          level: 'A1',
          schedule: 'Seg',
          description: '',
          createdAt: '2026-11-20',
        },
      ],
    };

    const merged = mergePlatformStates(local, remote, 'remote');
    expect(merged.classes.some((c) => c.id === 'class-deleted')).toBe(false);
  });

  it('preserves teacherAccessCode, user blocked flags, and assignment tombstones', () => {
    const local: PlatformState = {
      ...DEFAULT_PLATFORM_STATE,
      teacherAccessCode: 'SILAS-VIP-99',
      deletedAssignmentIds: ['assign-old'],
      users: [
        DEFAULT_PLATFORM_STATE.users[0],
        makeStudent({ id: 'stu-1', email: 'a@teste.com', blocked: true, blockedReason: 'Inadimplência' }),
      ],
      assignments: [
        {
          id: 'assign-1',
          title: 'Praticar Ditado A2',
          description: 'Conclua a unidade até sexta',
          languageCode: 'en',
          dueDate: '2026-12-01',
          createdAt: '2026-11-23',
          createdBy: 'Prof. Silas',
        },
      ],
    };

    const remote: Partial<PlatformState> = {
      teacherAccessCode: 'OLD-CODE',
      assignments: [
        {
          id: 'assign-old',
          title: 'Tarefa Apagada',
          description: 'Deve ficar oculta',
          languageCode: 'es',
          dueDate: '2026-11-30',
          createdAt: '2026-11-20',
          createdBy: 'Prof. Silas',
        },
      ],
    };

    const merged = mergePlatformStates(local, remote, 'local');
    expect(merged.teacherAccessCode).toBe('SILAS-VIP-99');
    expect(merged.users.find((u) => u.id === 'stu-1')?.blocked).toBe(true);
    expect(merged.assignments?.some((a) => a.id === 'assign-1')).toBe(true);
    expect(merged.assignments?.some((a) => a.id === 'assign-old')).toBe(false);
  });

  it('preserves VIP teacher linking, unlink notice, and individual studentId assignments across merges', () => {
    const local: PlatformState = {
      ...DEFAULT_PLATFORM_STATE,
      users: [
        DEFAULT_PLATFORM_STATE.users[0],
        makeStudent({
          id: 'stu-vip',
          email: 'vip@teste.com',
          assignedTeacherId: 'user-teacher-silas',
          enrollmentType: 'vip',
          unlinkedNoticePending: true,
          unlinkedByTeacherName: 'Prof. Silas',
        }),
      ],
      assignments: [
        {
          id: 'assign-vip-1',
          title: 'Praticar Speaking VIP',
          description: 'Enviar áudio da unidade A2-1',
          studentId: 'stu-vip',
          teacherId: 'user-teacher-silas',
          languageCode: 'it',
          dueDate: '2026-12-10',
          createdAt: '2026-11-23',
          createdBy: 'Prof. Silas',
        },
      ],
    };

    const remote: Partial<PlatformState> = {
      users: [
        makeStudent({
          id: 'stu-vip',
          email: 'vip@teste.com',
          enrollmentType: 'independent',
          unlinkedNoticePending: false,
        }),
      ],
    };

    const merged = mergePlatformStates(local, remote, 'local');
    const vip = merged.users.find((u) => u.id === 'stu-vip');
    expect(vip?.assignedTeacherId).toBe('user-teacher-silas');
    expect(vip?.enrollmentType).toBe('vip');
    expect(vip?.unlinkedNoticePending).toBe(true);
    expect(vip?.unlinkedByTeacherName).toBe('Prof. Silas');
    expect(merged.assignments?.find((a) => a.id === 'assign-vip-1')?.studentId).toBe(
      'stu-vip',
    );
  });
});
