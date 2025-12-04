import { UsersManagement } from "@/components/users/users-management"

export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
          <p className="text-muted-foreground">Управляйте пользователями системы, их ролями и правами доступа</p>
        </div>
        <UsersManagement />
      </div>
    </div>
  )
}
