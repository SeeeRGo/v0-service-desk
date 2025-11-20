import type { ServiceCategory } from "./types"

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "network",
    name: "Сетевые Технологии",
    subcategories: ["VPN", "Wi-Fi", "Роутеры", "Коммутаторы"],
  },
  {
    id: "security",
    name: "Защита Информационных Ресурсов",
    subcategories: ["Антивирус", "Firewall", "Аудит безопасности"],
  },
  {
    id: "hardware",
    name: "Вычислительная техника",
    subcategories: ["ПК", "Ноутбуки", "Периферия", "Серверы"],
  },
  {
    id: "software",
    name: "Прикладное программное обеспечение",
    subcategories: ["Office", "1C", "CRM", "ERP"],
  },
  {
    id: "database",
    name: "Эксплуатация Баз данных",
    subcategories: ["PostgreSQL", "MySQL", "Резервное копирование"],
  },
  {
    id: "email",
    name: "Корпоративная электронная почта",
    subcategories: ["Outlook", "Почтовые сервера", "Спам-фильтры"],
  },
  {
    id: "printing",
    name: "Услуги печати",
    subcategories: ["Принтеры", "МФУ", "Сканеры"],
  },
  {
    id: "internet",
    name: "Доступ к внешним ресурсам",
    subcategories: ["Интернет", "VPN", "Прокси"],
  },
  {
    id: "crm_system",
    name: "CRM",
    subcategories: ["Bitrix24", "Настройка", "Интеграции"],
  },
  {
    id: "billing",
    name: "Биллинг",
    subcategories: ["Учет", "Отчеты", "Интеграции"],
  },
]

export const TICKET_STATUS_LABELS = {
  active: "Активен",
  assigned: "Назначен",
  in_progress: "В работе",
  escalated: "Эскалировано",
  resolved: "Разрешен",
  closed: "Закрыто",
  waiting: "Ожидание",
}

export const TICKET_PRIORITY_LABELS = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
}

export const TICKET_TYPE_LABELS = {
  incident: "Инцидент",
  service_request: "Запрос на обслуживание",
}

export const SLA_DEADLINES = {
  critical: 2 * 60 * 60 * 1000, // 2 hours
  high: 4 * 60 * 60 * 1000, // 4 hours
  medium: 8 * 60 * 60 * 1000, // 8 hours
  low: 24 * 60 * 60 * 1000, // 24 hours
}
