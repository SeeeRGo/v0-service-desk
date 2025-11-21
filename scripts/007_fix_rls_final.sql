-- Окончательное исправление RLS политик без рекурсии
-- Выполните этот скрипт в SQL редакторе Supabase

-- ===================================================
-- 1. УДАЛЯЕМ ВСЕ ПРОБЛЕМНЫЕ ПОЛИТИКИ
-- ===================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view tickets based on role (SELECT)" ON public.tickets;
DROP POLICY IF EXISTS "Users can update tickets based on role (UPDATE)" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can create tickets (INSERT)" ON public.tickets;

-- Удаляем функцию если существует
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.get_ticket_user_role();

-- ===================================================
-- 2. СОЗДАЕМ ПРОСТУЮ ФУНКЦИЮ ДЛЯ ПОЛУЧЕНИЯ РОЛИ
-- ===================================================

-- Функция получает роль напрямую из auth.users metadata
CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt()->>'user_metadata'->>'role')::text,
    'client'
  );
$$;

-- ===================================================
-- 3. СОЗДАЕМ НОВЫЕ ПОЛИТИКИ БЕЗ РЕКУРСИИ
-- ===================================================

-- USERS TABLE - используем только auth.uid() и metadata
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  (auth.jwt()->>'user_metadata'->>'role')::text IN ('admin', 'supervisor')
);

-- TICKETS TABLE - используем функцию без обращения к users
CREATE POLICY "Users can view tickets based on role"
ON public.tickets
FOR SELECT
USING (
  CASE public.auth_user_role()
    WHEN 'admin' THEN true
    WHEN 'supervisor' THEN true
    WHEN 'engineer' THEN true
    WHEN 'client' THEN created_by = auth.uid()
    ELSE created_by = auth.uid()
  END
);

CREATE POLICY "Users can update tickets based on role"
ON public.tickets
FOR UPDATE
USING (
  CASE public.auth_user_role()
    WHEN 'admin' THEN true
    WHEN 'supervisor' THEN true
    WHEN 'engineer' THEN assigned_to = auth.uid()
    ELSE false
  END
);

CREATE POLICY "Authenticated users can create tickets"
ON public.tickets
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- ===================================================
-- 4. ПРОВЕРЯЕМ ЧТО RLS ВКЛЮЧЕН
-- ===================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- ГОТОВО!
-- ===================================================

-- Теперь политики используют только auth.uid() и auth.jwt()
-- без обращения к таблице users, что устраняет рекурсию
