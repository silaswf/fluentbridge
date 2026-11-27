/**
 * @file src/utils/tenantEngine.ts
 * @description Motor de multi-tenancy escolar: isolamento estrito por schoolId, resolução de URL/código de convite, alocação de alunos/professores e troca segura de professor na mesma escola.
 * @exports DEFAULT_SCHOOL_ID, DEFAULT_SCHOOL_SLUG, DEFAULT_SCHOOL_INVITE_CODE, createDefaultSchoolTenant, slugifySchoolName, generateSchoolInviteCode, ensureSchoolsList, resolveUserSchoolId, resolveEntitySchoolId, getEffectiveSchool, detectSchoolFromUrl, findSchoolByInviteCode, getSchoolTeachers, getSchoolClasses, scopePlatformStateForUser, allocateUserToSchool, reassignStudentTeacherInSchool
 */
import { isMasterAdminEmail } from '../config/appConfig';
import type {
  ClassGroup,
  PlatformState,
  SchoolTenant,
  StudentEnrollmentType,
  UserProfile,
} from '../types/learning';

export const DEFAULT_SCHOOL_ID = 'school-fluentbridge-main';
export const DEFAULT_SCHOOL_SLUG = 'fluentbridge';
export const DEFAULT_SCHOOL_INVITE_CODE = 'ESCOLA-FB';

export function createDefaultSchoolTenant(
  schoolName = 'FluentBridge Academy',
  ownerEmail = 'silaswf@gmail.com',
): SchoolTenant {
  return {
    id: DEFAULT_SCHOOL_ID,
    slug: DEFAULT_SCHOOL_SLUG,
    name: schoolName.trim() || 'FluentBridge Academy',
    inviteCode: DEFAULT_SCHOOL_INVITE_CODE,
    ownerEmail,
    primaryColor: '#116DFF',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

export function slugifySchoolName(name: string): string {
  const clean = (name || 'escola')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || 'escola';
}

export function generateSchoolInviteCode(name: string, slug?: string): string {
  const base = (slug || slugifySchoolName(name))
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'ESC';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ESCOLA-${base}-${rand}`;
}

export function ensureSchoolsList(
  schools: SchoolTenant[] | undefined,
  fallbackName = 'FluentBridge Academy',
): SchoolTenant[] {
  const list = Array.isArray(schools) ? [...schools] : [];
  const hasMain = list.some((s) => s.id === DEFAULT_SCHOOL_ID);
  if (!hasMain) {
    list.unshift(createDefaultSchoolTenant(fallbackName));
  }
  const seen = new Set<string>();
  return list.filter((s) => {
    if (!s?.id || seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

export function resolveUserSchoolId(
  user?: Pick<UserProfile, 'schoolId'> | null,
): string {
  return user?.schoolId?.trim() || DEFAULT_SCHOOL_ID;
}

export function resolveEntitySchoolId(
  entity?: { schoolId?: string } | null,
): string {
  return entity?.schoolId?.trim() || DEFAULT_SCHOOL_ID;
}

export function getEffectiveSchool(
  schools: SchoolTenant[] | undefined,
  schoolId?: string,
  fallbackName = 'FluentBridge Academy',
): SchoolTenant {
  const ensured = ensureSchoolsList(schools, fallbackName);
  const targetId = schoolId?.trim() || DEFAULT_SCHOOL_ID;
  return (
    ensured.find((s) => s.id === targetId) ??
    ensured.find((s) => s.id === DEFAULT_SCHOOL_ID) ??
    createDefaultSchoolTenant(fallbackName)
  );
}

export function detectSchoolFromUrl(
  schools: SchoolTenant[] | undefined,
  search?: string,
): SchoolTenant | null {
  const rawSearch =
    search !== undefined
      ? search
      : typeof window !== 'undefined'
        ? window.location.search
        : '';
  if (!rawSearch) return null;
  const params = new URLSearchParams(rawSearch);
  const slugParam = (params.get('escola') || params.get('school') || '')
    .trim()
    .toLowerCase();
  if (!slugParam) return null;
  const ensured = ensureSchoolsList(schools);
  return (
    ensured.find(
      (s) =>
        s.slug.toLowerCase() === slugParam ||
        s.id.toLowerCase() === slugParam ||
        s.inviteCode.toLowerCase() === slugParam,
    ) ?? null
  );
}

export function findSchoolByInviteCode(
  schools: SchoolTenant[] | undefined,
  code: string,
): SchoolTenant | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const ensured = ensureSchoolsList(schools);
  return (
    ensured.find(
      (s) =>
        s.inviteCode.trim().toUpperCase() === normalized ||
        s.slug.trim().toUpperCase() === normalized,
    ) ?? null
  );
}

export function getSchoolTeachers(
  users: UserProfile[],
  schoolId: string,
): UserProfile[] {
  const target = schoolId || DEFAULT_SCHOOL_ID;
  return users.filter(
    (u) =>
      u.role === 'teacher' &&
      !u.blocked &&
      resolveUserSchoolId(u) === target,
  );
}

export function getSchoolClasses(
  classes: ClassGroup[],
  schoolId: string,
): ClassGroup[] {
  const target = schoolId || DEFAULT_SCHOOL_ID;
  return classes.filter((c) => resolveEntitySchoolId(c) === target);
}

/**
 * Garante isolamento absoluto entre escolas:
 * - Master Admin com filtro 'ALL' (ou omitido) enxerga todos os tenants.
 * - Master Admin com filtro específico enxerga apenas o tenant selecionado.
 * - Qualquer outro usuário (aluno ou professor) enxerga ESTRITAMENTE entidades da sua escola.
 */
export function scopePlatformStateForUser(
  state: PlatformState,
  currentUser: UserProfile | null,
  adminSchoolFilter?: string,
): PlatformState {
  const schools = ensureSchoolsList(state.schools, state.schoolName);

  if (!currentUser) {
    return { ...state, schools };
  }

  const isMaster =
    Boolean(currentUser.isMasterAdmin) || isMasterAdminEmail(currentUser.email);

  const targetSchoolId = isMaster
    ? adminSchoolFilter && adminSchoolFilter !== 'ALL'
      ? adminSchoolFilter
      : null
    : resolveUserSchoolId(currentUser);

  if (!targetSchoolId) {
    return { ...state, schools };
  }

  const effectiveSchool = getEffectiveSchool(
    schools,
    targetSchoolId,
    state.schoolName,
  );

  const scopedUsers = state.users.filter(
    (u) =>
      u.id === currentUser.id || resolveUserSchoolId(u) === targetSchoolId,
  );
  const scopedUserIds = new Set(scopedUsers.map((u) => u.id));

  const scopedClasses = state.classes.filter(
    (c) => resolveEntitySchoolId(c) === targetSchoolId,
  );
  const scopedClassIds = new Set(scopedClasses.map((c) => c.id));

  const scopedSubmissions = state.submissions.filter(
    (s) =>
      resolveEntitySchoolId(s) === targetSchoolId &&
      (scopedUserIds.has(s.studentId) || !s.schoolId),
  );

  const scopedAssignments = (state.assignments ?? []).filter(
    (a) =>
      resolveEntitySchoolId(a) === targetSchoolId &&
      (!a.classId || scopedClassIds.has(a.classId)),
  );

  const scopedCustomTopics = state.customTopics.filter(
    (t) => resolveEntitySchoolId(t) === targetSchoolId,
  );

  const scopedCommunityPosts = (state.communityPosts ?? []).filter(
    (p) => resolveEntitySchoolId(p) === targetSchoolId,
  );

  const scopedLiveSessions = (state.liveSessions ?? []).filter(
    (ls) => resolveEntitySchoolId(ls) === targetSchoolId,
  );

  return {
    ...state,
    schools,
    schoolName: effectiveSchool.name,
    users: scopedUsers,
    classes: scopedClasses,
    submissions: scopedSubmissions,
    assignments: scopedAssignments,
    customTopics: scopedCustomTopics,
    communityPosts: scopedCommunityPosts,
    liveSessions: scopedLiveSessions,
  };
}

/**
 * Aloca um usuário (aluno ou professor) em uma escola.
 * Se o usuário for aluno e mudar de escola, desfaz vínculos de professor/turma da escola antiga
 * para impedir qualquer vínculo cruzado entre escolas diferentes.
 */
export function allocateUserToSchool(
  users: UserProfile[],
  classes: ClassGroup[],
  userId: string,
  targetSchoolId: string,
): UserProfile[] {
  const validSchoolId = targetSchoolId.trim() || DEFAULT_SCHOOL_ID;
  const targetTeachers = new Set(
    getSchoolTeachers(users, validSchoolId).map((t) => t.id),
  );
  const targetClasses = new Set(
    getSchoolClasses(classes, validSchoolId).map((c) => c.id),
  );

  return users.map((u) => {
    if (u.id !== userId) return u;
    const nextTeacherId =
      u.assignedTeacherId && targetTeachers.has(u.assignedTeacherId)
        ? u.assignedTeacherId
        : undefined;
    const nextClassId =
      u.classId && targetClasses.has(u.classId) ? u.classId : undefined;
    const nextEnrollment: StudentEnrollmentType | undefined =
      u.role === 'student'
        ? nextClassId
          ? 'class'
          : nextTeacherId
            ? 'vip'
            : 'independent'
        : u.enrollmentType;

    return {
      ...u,
      schoolId: validSchoolId,
      assignedTeacherId: nextTeacherId,
      classId: nextClassId,
      enrollmentType: nextEnrollment,
    };
  });
}

/**
 * Troca o professor responsável de um aluno DENTRO da mesma escola,
 * preservando schoolId, XP, progresso, vocabulário e certificados.
 * Bloqueia tentativa de vincular professor de outra escola.
 */
export function reassignStudentTeacherInSchool(
  users: UserProfile[],
  studentId: string,
  newTeacherId: string | undefined,
): { ok: boolean; users: UserProfile[]; error?: string } {
  const student = users.find((u) => u.id === studentId);
  if (!student) {
    return { ok: false, users, error: 'Aluno não encontrado.' };
  }
  const studentSchoolId = resolveUserSchoolId(student);

  if (newTeacherId) {
    const teacher = users.find(
      (u) => u.id === newTeacherId && u.role === 'teacher',
    );
    if (!teacher) {
      return { ok: false, users, error: 'Professor não encontrado.' };
    }
    if (resolveUserSchoolId(teacher) !== studentSchoolId) {
      return {
        ok: false,
        users,
        error: 'O professor selecionado pertence a outra escola.',
      };
    }
  }

  const updated: UserProfile[] = users.map((u) => {
    if (u.id !== studentId) return u;
    const nextEnrollment: StudentEnrollmentType = u.classId
      ? 'class'
      : newTeacherId
        ? 'vip'
        : 'independent';
    return {
      ...u,
      schoolId: studentSchoolId,
      assignedTeacherId: newTeacherId,
      enrollmentType: nextEnrollment,
      unlinkedNoticePending: false,
      unlinkedByTeacherName: undefined,
    };
  });

  return { ok: true, users: updated };
}
