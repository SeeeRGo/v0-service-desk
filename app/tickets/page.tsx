"use client"

import { useCallback, useEffect, useState } from "react"
import TicketList from "@/components/tickets/ticket-list"
import TicketFilters from "@/components/tickets/ticket-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TicketsPage() {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    assignedTo: "all",
  })
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [assignees, setAssignees] = useState<Array<{ id: string; full_name: string }>>([])

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [categoriesRes, usersRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/users?role=engineer"),
        ])

        if (categoriesRes.ok) {
          const catData = await categoriesRes.json()
          setCategories(catData.categories || [])
        }

        if (usersRes.ok) {
          const userData = await usersRes.json()
          setAssignees(userData.users || [])
        }
      } catch (error) {
        console.error("Failed to load filter data:", error)
      }
    }

    loadFilterData()
  }, [])

  const handleFiltersChange = useCallback(
    (newFilters: { status: string; priority: string; category: string; assignedTo: string }) => {
      setFilters(newFilters)
    },
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Заявки</h1>
          <p className="text-muted-foreground mt-1">Управление инцидентами и запросами на обслуживание</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="w-4 h-4 mr-2" />
            Создать заявку
          </Link>
        </Button>
      </div>

      <TicketFilters onFiltersChange={handleFiltersChange} categories={categories} assignees={assignees} />

      <TicketList filters={filters} />
    </div>
  )
}
