-- Исправление RLS политик для таблицы users
-- Удаление проблемных политик и создание правильных

-- Удаляем все существующие политики для таблицы users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Service role can do anything" ON public.users;

-- Создаем новые политики без рекурсии
-- Используем только auth.uid() без вложенных запросов к users

-- Политика: пользователи могут видеть свой профиль
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Политика: пользователи могут обновлять свой профиль
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Политика: администраторы могут видеть все профили
-- Проверяем роль через auth.jwt()
CREATE POLICY "Admins can view all profiles"
ON public.users
FOR SELECT
USING (
  auth.jwt()->>'role' = 'administrator'
  OR auth.jwt()->>'role' = 'supervisor'
);

-- Политика: администраторы могут обновлять все профили
CREATE POLICY "Admins can update all profiles"
ON public.users
FOR UPDATE
USING (
  auth.jwt()->>'role' = 'administrator'
  OR auth.jwt()->>'role' = 'supervisor'
);

-- Политика: разрешаем вставку новых пользователей при регистрации
CREATE POLICY "Allow insert during signup"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Создаем функцию для безопасной проверки роли пользователя
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = user_id LIMIT 1;
$$;

-- Альтернативная политика для просмотра (если нужно использовать роли из таблицы)
DROP POLICY IF EXISTS "Role based view access" ON public.users;
CREATE POLICY "Role based view access"
ON public.users
FOR SELECT
USING (
  auth.uid() = id 
  OR public.get_user_role(auth.uid()) IN ('administrator', 'supervisor')
);
