-- Добавление тестовых инженеров для проверки функционала
-- Эти пользователи будут созданы только для тестирования системы

INSERT INTO users (id, full_name, email, role, company_id)
VALUES 
  (gen_random_uuid(), 'Иван Петров', 'i.petrov@stilt.ru', 'engineer', (SELECT id FROM companies WHERE name = 'STILT' LIMIT 1)),
  (gen_random_uuid(), 'Мария Сидорова', 'm.sidorova@stilt.ru', 'engineer', (SELECT id FROM companies WHERE name = 'STILT' LIMIT 1)),
  (gen_random_uuid(), 'Алексей Козлов', 'a.kozlov@stilt.ru', 'engineer', (SELECT id FROM companies WHERE name = 'STILT' LIMIT 1)),
  (gen_random_uuid(), 'Елена Новикова', 'e.novikova@stilt.ru', 'supervisor', (SELECT id FROM companies WHERE name = 'STILT' LIMIT 1)),
  (gen_random_uuid(), 'Дмитрий Васильев', 'd.vasiliev@stilt.ru', 'supervisor', (SELECT id FROM companies WHERE name = 'STILT' LIMIT 1))
ON CONFLICT (email) DO NOTHING;

-- Проверка созданных пользователей
SELECT id, full_name, email, role FROM users WHERE role IN ('engineer', 'supervisor') ORDER BY full_name;
