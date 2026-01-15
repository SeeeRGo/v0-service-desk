"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, BarChart3, BookOpen, Settings, Users, LogOut, Columns3 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Панель управления", href: "/dashboard", icon: LayoutDashboard },
  { name: "Заявки", href: "/tickets", icon: Ticket },
  { name: "Канбан доска", href: "/kanban", icon: Columns3 },
  { name: "Отчеты", href: "/reports", icon: BarChart3 },
  { name: "База знаний", href: "/knowledge-base", icon: BookOpen },
  { name: "Пользователи", href: "/users", icon: Users },
  { name: "Настройки", href: "/settings", icon: Settings },
]

interface UserProfile {
  full_name: string
  email: string
  role: string
}

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, email, role")
            .eq("id", authUser.id)
            .single()

          if (profile) {
            setUser(profile)
          } else {
            setUser({
              full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Пользователь",
              email: authUser.email || "",
              role: authUser.user_metadata?.role || "client",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser({
          full_name: "Гость",
          email: "guest@example.com",
          role: "client",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/auth/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Администратор",
      supervisor: "Супервизор",
      engineer: "Инженер",
      client: "Клиент",
    }
    return roleMap[role] || role
  }

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
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-accent rounded animate-pulse" />
                <div className="h-3 bg-accent rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2 hover:bg-accent">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">{getInitials(user.full_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">{user.full_name}</p>
                    <p className="text-xs font-medium text-foreground/70 truncate">{formatRole(user.role)}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-sm">?</span>
              </div>
              <div>Загрузка...</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
