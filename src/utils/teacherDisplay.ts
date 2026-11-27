/**
 * @file src/utils/teacherDisplay.ts
 * @description Resolve o nome público exibido para professores (priorizando nome configurado no estúdio com fallback para cadastro).
 * @exports getTeacherDisplayName
 */
import type { UserProfile } from '../types/learning';

/**
 * Resolve o nome de exibição público de um professor:
 * 1. Nome configurado pelo próprio professor no Modo Professor (`teacherDisplayName`);
 * 2. Fallback para `schoolTeacherName` se for o administrador/professor principal e já houver valor salvo;
 * 3. Fallback final para o nome de cadastro (`name`).
 */
export function getTeacherDisplayName(
  teacher?: Pick<UserProfile, 'name' | 'teacherDisplayName' | 'isMasterAdmin'> | null,
  schoolTeacherName?: string,
): string {
  if (!teacher) {
    return schoolTeacherName?.trim() || 'Professor';
  }
  const ownDisplay = teacher.teacherDisplayName?.trim();
  if (ownDisplay) {
    return ownDisplay;
  }
  if (teacher.isMasterAdmin && schoolTeacherName?.trim()) {
    return schoolTeacherName.trim();
  }
  return teacher.name?.trim() || 'Professor';
}
