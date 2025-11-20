-- Insert default SLA definitions
INSERT INTO public.sla_definitions (name, priority, response_time_minutes, resolution_time_minutes) VALUES
  ('SLA - Критический', 'critical', 15, 240),
  ('SLA - Высокий', 'high', 30, 480),
  ('SLA - Средний', 'medium', 60, 1440),
  ('SLA - Низкий', 'low', 120, 2880)
ON CONFLICT DO NOTHING;

-- Insert default service categories
INSERT INTO public.service_categories (name, description) VALUES
  ('Сетевые Технологии', 'Вопросы связанные с сетью'),
  ('Защита Информационных Ресурсов', 'Вопросы информационной безопасности'),
  ('Вычислительная техника', 'Проблемы с оборудованием'),
  ('Прикладное программное обеспечение', 'Вопросы по ПО'),
  ('Эксплуатация Баз данных', 'Проблемы с базами данных'),
  ('Корпоративная электронная почта', 'Проблемы с почтой'),
  ('Доступ к внешним информационным ресурсам', 'Доступ к интернету и внешним ресурсам'),
  ('Документооборот', 'Вопросы по системам документооборота'),
  ('CRM', 'Вопросы по CRM системе'),
  ('Биллинг', 'Вопросы по биллинговой системе')
ON CONFLICT DO NOTHING;

-- Insert demo company
INSERT INTO public.companies (id, name, address) VALUES
  ('00000000-0000-0000-0000-000000000001'::UUID, 'STILT', 'г. Тольятти, ул. Новый проезд 8')
ON CONFLICT DO NOTHING;
