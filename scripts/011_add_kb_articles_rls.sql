-- Добавление RLS политик для таблицы kb_articles

-- Включаем RLS если не включено
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если есть
DROP POLICY IF EXISTS "Anyone can view published KB articles" ON kb_articles;
DROP POLICY IF EXISTS "Authenticated users can create KB articles" ON kb_articles;
DROP POLICY IF EXISTS "Authors can update their own KB articles" ON kb_articles;
DROP POLICY IF EXISTS "Admins can update any KB articles" ON kb_articles;

-- Все могут читать опубликованные статьи
CREATE POLICY "Anyone can view published KB articles"
ON kb_articles FOR SELECT
USING (true);

-- Авторизованные пользователи могут создавать статьи
CREATE POLICY "Authenticated users can create KB articles"
ON kb_articles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Авторы могут обновлять свои статьи
CREATE POLICY "Authors can update their own KB articles"
ON kb_articles FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Администраторы могут обновлять любые статьи
CREATE POLICY "Admins can update any KB articles"
ON kb_articles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Администраторы могут удалять статьи
CREATE POLICY "Admins can delete KB articles"
ON kb_articles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);
