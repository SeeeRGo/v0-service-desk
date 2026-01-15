"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import type { Ticket, TicketStatus } from "@/lib/types"
import { TICKET_STATUS_LABELS } from "@/lib/constants"
import KanbanCard from "./kanban-card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const COLUMN_ORDER: TicketStatus[] = ["active", "assigned", "in_progress", "waiting", "escalated", "resolved", "closed"]

export default function KanbanBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      if (response.ok) {
        const data = await response.json()
        const ticketsArray = Array.isArray(data) ? data : data.tickets || []
        console.log("[v0] Loaded tickets:", ticketsArray.length)
        setTickets(ticketsArray)
      }
    } catch (error) {
      console.error("Error loading tickets:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTicketsByStatus = (status: TicketStatus): Ticket[] => {
    return tickets.filter((ticket) => ticket.status === status)
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as TicketStatus
    const ticketId = draggableId

    // Optimistic update
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)))

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket")
      }

      toast({
        title: "Статус обновлен",
        description: `Заявка перемещена в "${TICKET_STATUS_LABELS[newStatus]}"`,
      })
    } catch (error) {
      console.error("Error updating ticket:", error)
      // Revert on error
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: source.droppableId as TicketStatus } : ticket,
        ),
      )
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMN_ORDER.map((status) => {
          const columnTickets = getTicketsByStatus(status)
          return (
            <div key={status} className="flex-shrink-0 w-80">
              <div className="bg-muted/30 rounded-lg p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{TICKET_STATUS_LABELS[status]}</h3>
                  <span className="text-sm text-muted-foreground bg-background rounded-full px-2 py-0.5">
                    {columnTickets.length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 overflow-y-auto min-h-[200px] rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-accent/50" : ""
                      }`}
                    >
                      {columnTickets.map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-50" : ""}
                            >
                              <KanbanCard ticket={ticket} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnTickets.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          Перетащите заявки сюда
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
