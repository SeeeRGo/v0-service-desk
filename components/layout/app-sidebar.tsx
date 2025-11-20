"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, BarChart3, BookOpen, Settings, Users } from "lucide-react"

const navigation = [
  { name: "Панель управления", href: "/dashboard", icon: LayoutDashboard },
  { name: "Заявки", href: "/tickets", icon: Ticket },
  { name: "Отчеты", href: "/reports", icon: BarChart3 },
  { name: "База знаний", href: "/knowledge-base", icon: BookOpen },
  { name: "Пользователи", href: "/users", icon: Users },
  { name: "Настройки", href: "/settings", icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">STILT</span>
            <span className="text-xs text-muted-foreground leading-tight">Service Desk</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-semibold">ЕВ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Елена Волкова</p>
              <p className="text-xs text-muted-foreground truncate">Администратор</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
