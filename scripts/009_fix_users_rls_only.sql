-- Минимальный скрипт для исправления RLS политик таблицы users
-- Удаляет все существующие политики и создает простые без рекурсии

-- Отключаем RLS чтобы удалить политики
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Удаляем все существующие политики для users
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Role based view access" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow insert during signup" ON public.users;

-- Включаем RLS обратно
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Создаем простые политики без рекурсии

-- 1. Пользователи могут видеть свой собственный профиль
CREATE POLICY "users_select_own"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Администраторы и супервизоры видят всех пользователей
CREATE POLICY "users_select_admin"
ON public.users
FOR SELECT
TO authenticated
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role')::text,
    (SELECT role FROM auth.users WHERE id = auth.uid())
  ) IN ('admin', 'supervisor')
);

-- 3. Пользователи могут обновлять свой профиль
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Администраторы могут управлять всеми пользователями
CREATE POLICY "users_all_admin"
ON public.users
FOR ALL
TO authenticated
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role')::text,
    (SELECT role FROM auth.users WHERE id = auth.uid())
  ) = 'admin'
);

-- 5. Разрешить вставку при регистрации (для триггера)
CREATE POLICY "users_insert_signup"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
