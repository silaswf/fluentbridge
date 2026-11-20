# 04 — Guia de Sincronização Online com Supabase

Este guia documenta a arquitetura de banco de dados do **FluentBridge** no projeto Supabase (`https://wyonvrrcdoikrspbpeis.supabase.co`), suas tabelas, permissões e fluxo de sincronização entre **Windows**, **Android** e **Web**.

---

## 1. Modelo Híbrido Atual (`v1.0.3`)

O schema completo está versionado em [`supabase_schema.sql`](../supabase_schema.sql) e espelhado na constante `SUPABASE_SQL_SCHEMA` em [`src/utils/cloudSync.ts`](../src/utils/cloudSync.ts). Ele contém duas camadas complementares:

1. **Snapshot Rápido Compartilhado (`public.fb_school_state`)**:
   - Armazena o estado consolidado da escola (`school_slug = 'fluentbridge-main'`, coluna `state jsonb`, `updated_at timestamptz`).
   - É utilizado atualmente pelo startup do `App.tsx`, pelo auto-sync com debounce de `2.500 ms` e pelos botões manuais **Enviar p/ Nuvem** / **Baixar da Nuvem** no Estúdio do Professor.
   - Antes do envio (`pushStateToCloud`), chaves locais sensíveis como `geminiApiKey` são limpas do snapshot compartilhado (`geminiApiKey: ''`).
   - Ao baixar na inicialização, `App.tsx` faz merge preservando usuários recém-autenticados localmente (`mergedUsers`) para evitar sobrescrita durante login Google/cadastro.

2. **Schema Relacional de Produção com RLS (`public.profiles`, `classes`, `class_members`, `student_progress`, `custom_topics`, `submissions`, `certificates`) + Storage (`speaking-audios`)**:
   - Já provisionado no Supabase para isolamento estrito por aluno/professor com **Row Level Security (RLS)** e migração planejada na **Fase 5 (`v1.1.0`)**.

---

## 2. Permissões (`GRANT`) & Políticas RLS Essenciais

Para que o cliente web/mobile (`sb_publishable_...` / role `anon` e `authenticated`) consiga ler e gravar sem receber erro HTTP `401` / código PostgreSQL `42501 permission denied`, o `supabase_schema.sql` inclui explicitamente:

```sql
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
```

E a função auxiliar `public.is_teacher()` (`security definer`, `stable`) verifica na tabela `public.profiles` se `auth.uid()` possui `role = 'teacher'`, liberando acesso docente às turmas, envios e certificados.

---

## 3. Fluxo de Auto-Sync & Diagnóstico no App

- **Startup (`App.tsx`)**:
  1. Carrega o estado local imediato de `localStorage` (`fluentbridge_platform_v3`), garantindo abertura instantânea mesmo sem internet.
  2. Se o Supabase estiver ativo (`getEffectiveSupabaseConfig`), executa `pullStateFromCloud`, normaliza via `normalizePlatformState` (removendo resíduos demo e garantindo presença de `silaswf@gmail.com`) e atualiza `autoSyncStatus`.
- **Sincronização Contínua**:
  - Alterações em lições, vocabulário, turmas ou correções disparam envio em segundo plano após `2,5s` de ociosidade (`pushStateToCloud`), protegido pela flag `skipNextCloudPushRef` para evitar loops após download.
- **Painel de Nuvem & Backup (`TeacherStudio.tsx` → aba `Nuvem & IA`)**:
  - Exibe status em tempo real (**Supabase Fixo Conectado** / **Auto-sync ativo**), botões de teste/envio/download manual e **Exportar / Importar Backup completo (`.json`)**.
  - Mensagens amigáveis para erro `42501` instruindo exatamente o comando `GRANT` caso seja aplicado em uma nova instância Supabase do zero.
