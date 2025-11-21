-- Добавляем политику чтения для таблицы users
-- Это позволит делать JOIN с users при получении заявок

-- Создаем политику для чтения пользователей
CREATE POLICY "Authenticated users can read all users"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Проверяем что политика создана
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
