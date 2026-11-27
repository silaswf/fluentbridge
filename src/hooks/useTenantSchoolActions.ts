/**
 * @file src/hooks/useTenantSchoolActions.ts
 * @description Hook customizado encapsulando ações multi-tenant de administração e coordenação escolar (escolas, branding, importação CSV, alocação, docentes e auditoria).
 * @exports useTenantSchoolActions
 */
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { LANGUAGE_COURSES_META } from '../data/platformDefaults';
import type {
  AdminAuditLogEntry,
  PlatformState,
  SchoolTenant,
  UserProfile,
} from '../types/learning';
import { getTeacherDisplayName } from '../utils/teacherDisplay';
import {
  allocateUserToSchool,
  DEFAULT_SCHOOL_ID,
  ensureSchoolsList,
  generateSchoolInviteCode,
  getEffectiveSchool,
  reassignStudentTeacherInSchool,
  slugifySchoolName,
} from '../utils/tenantEngine';

export interface UseTenantSchoolActionsOptions {
  setState: Dispatch<SetStateAction<PlatformState>>;
  showToast: (message: string) => void;
  actorEmail?: string;
}

export interface CreateSchoolPayload {
  name: string;
  inviteCode?: string;
  ownerEmail?: string;
  primaryColor?: string;
  logoUrl?: string;
}

export interface UpdateSchoolBrandingPayload {
  name?: string;
  primaryColor?: string;
  logoUrl?: string;
}

function buildAuditEntry(
  actorEmail: string,
  action: string,
  targetLabel: string,
  schoolId?: string,
): AdminAuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actorEmail: actorEmail || 'admin@fluentbridge.app',
    action,
    targetLabel,
    schoolId,
    createdAt: new Date().toISOString(),
  };
}

export function useTenantSchoolActions({
  setState,
  showToast,
  actorEmail = 'admin@fluentbridge.app',
}: UseTenantSchoolActionsOptions) {
  const appendAuditLog = useCallback(
    (action: string, targetLabel: string, schoolId?: string) => {
      const entry = buildAuditEntry(actorEmail, action, targetLabel, schoolId);
      setState((prev) => ({
        ...prev,
        auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
      }));
    },
    [actorEmail, setState],
  );

  const createSchool = useCallback(
    (payload: CreateSchoolPayload) => {
      const cleanName = payload.name.trim();
      if (!cleanName) return;

      let createdCode = '';
      setState((prev) => {
        const schools = ensureSchoolsList(prev.schools, prev.schoolName);
        const baseSlug = slugifySchoolName(cleanName);
        const uniqueSlug = schools.some((s) => s.slug === baseSlug)
          ? `${baseSlug}-${Math.floor(10 + Math.random() * 89)}`
          : baseSlug;
        const inviteCode =
          payload.inviteCode?.trim().toUpperCase() ||
          generateSchoolInviteCode(cleanName, uniqueSlug);
        createdCode = inviteCode;

        const newSchool: SchoolTenant = {
          id: `school-${Date.now()}`,
          slug: uniqueSlug,
          name: cleanName,
          inviteCode,
          ownerEmail: payload.ownerEmail?.trim() || undefined,
          primaryColor: payload.primaryColor || '#116DFF',
          logoUrl: payload.logoUrl?.trim() || undefined,
          status: 'active',
          createdAt: new Date().toISOString().slice(0, 10),
        };

        const entry = buildAuditEntry(
          actorEmail,
          'CREATE_SCHOOL',
          `${cleanName} (${inviteCode})`,
          newSchool.id,
        );

        return {
          ...prev,
          schools: [...schools, newSchool],
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });

      showToast(`Escola "${cleanName}" criada · Código: ${createdCode}`);
    },
    [actorEmail, setState, showToast],
  );

  const toggleSchoolStatus = useCallback(
    (schoolId: string) => {
      if (schoolId === DEFAULT_SCHOOL_ID) return;
      setState((prev) => {
        const schools = ensureSchoolsList(prev.schools, prev.schoolName);
        const target = schools.find((s) => s.id === schoolId);
        const nextStatus: SchoolTenant['status'] =
          target?.status === 'active' ? 'suspended' : 'active';
        const entry = buildAuditEntry(
          actorEmail,
          nextStatus === 'suspended' ? 'SUSPEND_SCHOOL' : 'ACTIVATE_SCHOOL',
          target?.name ?? schoolId,
          schoolId,
        );
        return {
          ...prev,
          schools: schools.map((s) =>
            s.id === schoolId ? { ...s, status: nextStatus } : s,
          ),
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });
      showToast('Status da escola atualizado.');
    },
    [actorEmail, setState, showToast],
  );

  const updateSchoolBranding = useCallback(
    (schoolId: string, branding: UpdateSchoolBrandingPayload) => {
      setState((prev) => {
        const schools = ensureSchoolsList(prev.schools, prev.schoolName);
        const target = schools.find((s) => s.id === schoolId);
        if (!target) return prev;
        const updatedName = branding.name?.trim() || target.name;
        const entry = buildAuditEntry(
          actorEmail,
          'UPDATE_SCHOOL_BRANDING',
          updatedName,
          schoolId,
        );
        return {
          ...prev,
          schools: schools.map((s) =>
            s.id === schoolId
              ? {
                  ...s,
                  name: updatedName,
                  primaryColor: branding.primaryColor ?? s.primaryColor,
                  logoUrl:
                    branding.logoUrl !== undefined
                      ? branding.logoUrl.trim() || undefined
                      : s.logoUrl,
                }
              : s,
          ),
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });
      showToast('Identidade visual da escola atualizada.');
    },
    [actorEmail, setState, showToast],
  );

  const importSchoolStudentsCsv = useCallback(
    (schoolId: string, csvText: string) => {
      const lines = csvText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) {
        showToast('CSV vazio. Informe linhas no formato nome,email.');
        return 0;
      }

      let importedCount = 0;
      let skippedCount = 0;

      setState((prev) => {
        const existingEmails = new Set(
          prev.users.map((u) => u.email.trim().toLowerCase()),
        );
        const newUsers: UserProfile[] = [];
        const today = new Date().toISOString().slice(0, 10);

        for (let i = 0; i < lines.length; i += 1) {
          const parts = lines[i]
            .split(/[,;\t]/)
            .map((p) => p.replace(/^["']|["']$/g, '').trim());
          if (parts.length < 2) continue;

          const [rawName, rawEmail] = parts;
          const lowerEmail = rawEmail.toLowerCase();
          if (i === 0 && (lowerEmail === 'email' || lowerEmail === 'e-mail')) {
            continue;
          }
          if (!rawName || !lowerEmail.includes('@')) {
            skippedCount += 1;
            continue;
          }
          if (existingEmails.has(lowerEmail)) {
            skippedCount += 1;
            continue;
          }

          existingEmails.add(lowerEmail);
          importedCount += 1;
          newUsers.push({
            id: `stu-csv-${Date.now()}-${i}`,
            schoolId,
            name: rawName,
            email: lowerEmail,
            password: Math.random().toString(36).slice(2, 10),
            role: 'student',
            enrollmentType: 'independent',
            avatarColor: '#116DFF',
            activeLanguage: 'en',
            dialectByLanguage: Object.fromEntries(
              LANGUAGE_COURSES_META.map((c) => [
                c.code,
                c.dialects[0]?.code ?? 'en-US',
              ]),
            ),
            accent: 'en-US',
            dailyGoalMinutes: 15,
            todayMinutes: 0,
            xp: 0,
            streakDays: 1,
            completedTopicIds: [],
            skillScores: {
              listening: 45,
              reading: 45,
              speaking: 40,
              writing: 45,
            },
            vocab: [],
            issuedCertificates: [],
            dailyQuests: {
              lessonsCompletedToday: 0,
              vocabReviewedToday: 0,
              tutorSessionsToday: 0,
              claimedQuestIds: [],
            },
            createdAt: today,
          });
        }

        if (newUsers.length === 0) return prev;

        const entry = buildAuditEntry(
          actorEmail,
          'IMPORT_STUDENTS_CSV',
          `${newUsers.length} aluno(s) importado(s)`,
          schoolId,
        );

        return {
          ...prev,
          users: [...prev.users, ...newUsers],
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });

      showToast(
        importedCount > 0
          ? `${importedCount} aluno(s) importado(s)${skippedCount > 0 ? ` (${skippedCount} ignorado(s))` : ''}.`
          : 'Nenhum novo aluno válido encontrado no CSV.',
      );
      return importedCount;
    },
    [actorEmail, setState, showToast],
  );

  const allocateUserSchool = useCallback(
    (userId: string, targetSchoolId: string) => {
      let targetSchoolName = targetSchoolId;
      setState((prev) => {
        const targetSchool = getEffectiveSchool(
          prev.schools,
          targetSchoolId,
          prev.schoolName,
        );
        targetSchoolName = targetSchool.name;
        const targetUser = prev.users.find((u) => u.id === userId);
        const entry = buildAuditEntry(
          actorEmail,
          'ALLOCATE_USER_SCHOOL',
          `${targetUser?.name ?? userId} → ${targetSchool.name}`,
          targetSchoolId,
        );
        return {
          ...prev,
          users: allocateUserToSchool(
            prev.users,
            prev.classes,
            userId,
            targetSchoolId,
          ),
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });
      showToast(`Usuário alocado para "${targetSchoolName}".`);
    },
    [actorEmail, setState, showToast],
  );

  const reassignStudentTeacher = useCallback(
    (studentId: string, newTeacherId: string | undefined) => {
      let errorMsg: string | undefined;
      let toastMsg = '';

      setState((prev) => {
        const res = reassignStudentTeacherInSchool(
          prev.users,
          studentId,
          newTeacherId,
        );
        if (!res.ok) {
          errorMsg = res.error ?? 'Erro ao trocar professor.';
          return prev;
        }
        const newTeacher = newTeacherId
          ? prev.users.find((u) => u.id === newTeacherId)
          : undefined;
        const student = prev.users.find((u) => u.id === studentId);
        toastMsg = newTeacher
          ? `Professor alterado para ${getTeacherDisplayName(newTeacher, prev.teacherName)} (escola e XP preservados).`
          : 'Professor desvinculado mantendo a escola do aluno.';

        const entry = buildAuditEntry(
          actorEmail,
          'REASSIGN_STUDENT_TEACHER',
          `${student?.name ?? studentId} → ${newTeacher?.name ?? 'Sem professor'}`,
          student?.schoolId,
        );

        return {
          ...prev,
          users: res.users,
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });

      if (errorMsg) {
        showToast(errorMsg);
      } else if (toastMsg) {
        showToast(toastMsg);
      }
    },
    [actorEmail, setState, showToast],
  );

  const toggleSchoolAdminRole = useCallback(
    (userId: string) => {
      let toastMsg = '';
      setState((prev) => {
        const target = prev.users.find((u) => u.id === userId);
        if (!target || target.isMasterAdmin) return prev;
        const nextVal = !target.isSchoolAdmin;
        toastMsg = nextVal
          ? `${target.name} agora é Coordenador(a) da Escola.`
          : `${target.name} não é mais Coordenador(a) da Escola.`;
        const entry = buildAuditEntry(
          actorEmail,
          nextVal ? 'GRANT_SCHOOL_ADMIN' : 'REVOKE_SCHOOL_ADMIN',
          target.name,
          target.schoolId,
        );
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === userId ? { ...u, isSchoolAdmin: nextVal } : u,
          ),
          auditLogs: [entry, ...(prev.auditLogs ?? [])].slice(0, 200),
        };
      });
      if (toastMsg) showToast(toastMsg);
    },
    [actorEmail, setState, showToast],
  );

  return {
    createSchool,
    toggleSchoolStatus,
    updateSchoolBranding,
    importSchoolStudentsCsv,
    allocateUserSchool,
    reassignStudentTeacher,
    toggleSchoolAdminRole,
    appendAuditLog,
  };
}
