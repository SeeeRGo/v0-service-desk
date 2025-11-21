-- =====================================================
-- FIX RLS POLICIES - УСТРАНЕНИЕ БЕСКОНЕЧНОЙ РЕКУРСИИ
-- =====================================================
-- Этот скрипт удаляет проблемные RLS политики и создает новые без рекурсии
-- Выполните этот скрипт в SQL Editor вашего Supabase проекта

-- =====================================================
-- STEP 1: Удаляем ВСЕ политики (начинаем с чистого листа)
-- =====================================================

-- Удаляем политики для таблицы users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users CASCADE;
DROP POLICY IF EXISTS "Admins and supervisors can view all users" ON public.users CASCADE;
DROP POLICY IF EXISTS "Admins can update users" ON public.users CASCADE;

-- Удаляем политики для таблицы tickets
DROP POLICY IF EXISTS "Users can view tickets based on role" ON public.tickets CASCADE;
DROP POLICY IF EXISTS "Authenticated users can create tickets" ON public.tickets CASCADE;
DROP POLICY IF EXISTS "Engineers can update tickets" ON public.tickets CASCADE;
DROP POLICY IF EXISTS "Supervisors and admins can update all tickets" ON public.tickets CASCADE;

-- Удаляем политики для остальных таблиц
DROP POLICY IF EXISTS "Users can view their company" ON public.companies CASCADE;
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies CASCADE;
DROP POLICY IF EXISTS "Users can view comments on their tickets" ON public.ticket_comments CASCADE;
DROP POLICY IF EXISTS "Users can create comments" ON public.ticket_comments CASCADE;
DROP POLICY IF EXISTS "Users can view ticket history" ON public.ticket_history CASCADE;
DROP POLICY IF EXISTS "Everyone can view knowledge base" ON public.knowledge_base CASCADE;
DROP POLICY IF EXISTS "Engineers can manage knowledge base" ON public.knowledge_base CASCADE;
DROP POLICY IF EXISTS "Everyone can view categories" ON public.service_categories CASCADE;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories CASCADE;
DROP POLICY IF EXISTS "Everyone can view SLA" ON public.sla_policies CASCADE;
DROP POLICY IF EXISTS "Admins can manage SLA" ON public.sla_policies CASCADE;

-- =====================================================
-- STEP 2: Удаляем вспомогательные функции
-- =====================================================

DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS get_ticket_user_role() CASCADE;

-- =====================================================
-- STEP 3: Создаем ПРОСТЫЕ политики БЕЗ рекурсии
-- =====================================================

-- Политики для таблицы users (САМЫЕ ПРОСТЫЕ - без вложенных запросов)
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_select_admin"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' IN ('admin', 'supervisor'))
    )
  );

-- Политики для таблицы tickets (БЕЗ обращения к таблице users)
CREATE POLICY "tickets_select_all"
  ON public.tickets FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "tickets_insert_auth"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "tickets_update_own"
  ON public.tickets FOR UPDATE
  USING (created_by = auth.uid() OR assigned_to = auth.uid());

-- Политики для companies
CREATE POLICY "companies_select_all"
  ON public.companies FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "companies_all_admin"
  ON public.companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Политики для service_categories
CREATE POLICY "categories_select_all"
  ON public.service_categories FOR SELECT
  USING (true);

CREATE POLICY "categories_all_admin"
  ON public.service_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Политики для ticket_comments
CREATE POLICY "comments_select_auth"
  ON public.ticket_comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "comments_insert_auth"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Политики для ticket_history
CREATE POLICY "history_select_auth"
  ON public.ticket_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Политики для knowledge_base
CREATE POLICY "kb_select_all"
  ON public.knowledge_base FOR SELECT
  USING (true);

CREATE POLICY "kb_all_engineer"
  ON public.knowledge_base FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('engineer', 'supervisor', 'admin')
    )
  );

-- Политики для sla_policies
CREATE POLICY "sla_select_all"
  ON public.sla_policies FOR SELECT
  USING (true);

CREATE POLICY "sla_all_admin"
  ON public.sla_policies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- ГОТОВО!
-- =====================================================
-- После выполнения этого скрипта:
-- 1. Все политики будут пересозданы БЕЗ рекурсии
-- 2. Используются только auth.uid() и auth.users (НЕ public.users)
-- 3. Бесконечная рекурсия должна быть устранена
-- =====================================================
